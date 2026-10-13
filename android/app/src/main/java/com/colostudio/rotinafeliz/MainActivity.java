package com.colostudio.rotinafeliz;

import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // a loja (compra unica e restauracao) e um plugin deste app
        registerPlugin(LojaPlugin.class);
        super.onCreate(savedInstanceState);
        // O voltar do celular vai para o jogo, que faz o mesmo que o botao de
        // voltar da tela (src/main.ts). Sem isto o app fechava no meio da
        // missao. O callback fica sempre ligado: o jogo nunca fecha pelo voltar.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                getBridge().getWebView().evaluateJavascript("window.dispatchEvent(new Event('voltar'))", null);
            }
        });
    }
}
