package com.colostudio.rotinafeliz;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Collections;
import java.util.List;

/**
 * A loja: a compra unica e a restauracao, direto na Play Billing Library.
 * Fala so com o app da Play Store do aparelho; nada sai para outro servidor.
 * O lado do jogo esta em src/compras.ts.
 *
 * Os dois metodos devolvem { ok: true } quando o produto esta comprado e
 * reconhecido, e { ok: false } em qualquer outro caso (cancelou, sem loja,
 * pagamento pendente, erro). O jogo trata false como "nao abriu".
 */
@CapacitorPlugin(name = "Loja")
public class LojaPlugin extends Plugin implements PurchasesUpdatedListener {
    private BillingClient cliente;
    private PluginCall compraEmAndamento;
    private String produtoEmAndamento;

    @Override
    public void load() {
        cliente = BillingClient.newBuilder(getContext())
            .setListener(this)
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .enableAutoServiceReconnection()
            .build();
    }

    private static JSObject resposta(boolean ok) {
        JSObject r = new JSObject();
        r.put("ok", ok);
        return r;
    }

    /** Roda `pronto` com a loja conectada; se nao conectar, responde false. */
    private void conectado(PluginCall call, Runnable pronto) {
        if (cliente.isReady()) {
            pronto.run();
            return;
        }
        cliente.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult r) {
                if (r.getResponseCode() == BillingClient.BillingResponseCode.OK) pronto.run();
                else call.resolve(resposta(false));
            }

            @Override
            public void onBillingServiceDisconnected() {
                // a biblioteca reconecta sozinha (enableAutoServiceReconnection)
            }
        });
    }

    private static boolean comprado(Purchase p, String produto) {
        return p.getProducts().contains(produto) && p.getPurchaseState() == Purchase.PurchaseState.PURCHASED;
    }

    /** Compra sem reconhecer em 3 dias e devolvida pela Play: reconhece e so entao responde. */
    private void reconhecer(Purchase p, PluginCall call) {
        if (p.isAcknowledged()) {
            call.resolve(resposta(true));
            return;
        }
        AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder().setPurchaseToken(p.getPurchaseToken()).build();
        cliente.acknowledgePurchase(params, r -> call.resolve(resposta(r.getResponseCode() == BillingClient.BillingResponseCode.OK)));
    }

    @PluginMethod
    public void comprar(PluginCall call) {
        String produto = call.getString("produto");
        if (produto == null || compraEmAndamento != null) {
            call.resolve(resposta(false));
            return;
        }
        conectado(call, () -> {
            QueryProductDetailsParams.Product item = QueryProductDetailsParams.Product.newBuilder()
                .setProductId(produto)
                .setProductType(BillingClient.ProductType.INAPP)
                .build();
            QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(Collections.singletonList(item))
                .build();
            cliente.queryProductDetailsAsync(params, (r, resultado) -> {
                List<ProductDetails> lista = resultado.getProductDetailsList();
                if (r.getResponseCode() != BillingClient.BillingResponseCode.OK || lista.isEmpty()) {
                    call.resolve(resposta(false));
                    return;
                }
                BillingFlowParams.ProductDetailsParams detalhes = BillingFlowParams.ProductDetailsParams.newBuilder()
                    .setProductDetails(lista.get(0))
                    .build();
                BillingFlowParams fluxo = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(Collections.singletonList(detalhes))
                    .build();
                compraEmAndamento = call;
                produtoEmAndamento = produto;
                getActivity().runOnUiThread(() -> {
                    BillingResult aberto = cliente.launchBillingFlow(getActivity(), fluxo);
                    if (aberto.getResponseCode() != BillingClient.BillingResponseCode.OK) terminarCompra(false, null);
                });
            });
        });
    }

    /** A tela da Play fechou: comprou, cancelou ou deu erro. */
    @Override
    public void onPurchasesUpdated(BillingResult r, List<Purchase> compras) {
        if (compraEmAndamento == null) return;
        if (r.getResponseCode() != BillingClient.BillingResponseCode.OK || compras == null) {
            terminarCompra(false, null);
            return;
        }
        for (Purchase p : compras) {
            if (comprado(p, produtoEmAndamento)) {
                terminarCompra(true, p);
                return;
            }
        }
        terminarCompra(false, null);
    }

    private void terminarCompra(boolean ok, Purchase p) {
        PluginCall call = compraEmAndamento;
        compraEmAndamento = null;
        produtoEmAndamento = null;
        if (call == null) return;
        if (ok) reconhecer(p, call);
        else call.resolve(resposta(false));
    }

    /**
     * Quem ja comprou com a conta da Play Store deste aparelho recupera por
     * aqui (trocou de celular, reinstalou). A Play identifica pela conta que
     * esta na loja; nao existe "digitar o e-mail".
     */
    @PluginMethod
    public void restaurar(PluginCall call) {
        String produto = call.getString("produto");
        if (produto == null) {
            call.resolve(resposta(false));
            return;
        }
        conectado(call, () -> {
            QueryPurchasesParams params = QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build();
            cliente.queryPurchasesAsync(params, (r, compras) -> {
                if (r.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    call.resolve(resposta(false));
                    return;
                }
                for (Purchase p : compras) {
                    if (comprado(p, produto)) {
                        reconhecer(p, call);
                        return;
                    }
                }
                call.resolve(resposta(false));
            });
        });
    }
}
