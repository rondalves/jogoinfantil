package com.colostudio.rotinafeliz;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import androidx.core.content.pm.ShortcutInfoCompat;
import androidx.core.content.pm.ShortcutManagerCompat;
import androidx.core.graphics.drawable.IconCompat;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.json.JSONObject;

/**
 * Atalhos com o rosto de cada crianca: no menu de segurar o icone do app e,
 * se o adulto aceitar, na tela inicial. Tocar abre o jogo direto no perfil.
 * O rosto vem desenhado pelo jogo (src/atalhos.ts), como PNG em base64.
 */
@CapacitorPlugin(name = "Atalho")
public class AtalhoPlugin extends Plugin {
    static final String EXTRA_PERFIL = "perfil";

    private ShortcutInfoCompat atalho(String id, String nome, String icone) {
        byte[] png = Base64.decode(icone, Base64.DEFAULT);
        Bitmap rosto = BitmapFactory.decodeByteArray(png, 0, png.length);
        Intent abrir = new Intent(getContext(), MainActivity.class)
            .setAction(Intent.ACTION_VIEW)
            .putExtra(EXTRA_PERFIL, id);
        return new ShortcutInfoCompat.Builder(getContext(), "perfil_" + id)
            .setShortLabel(nome)
            .setLongLabel("Jogar: " + nome)
            .setIcon(IconCompat.createWithAdaptiveBitmap(rosto))
            .setIntent(abrir)
            .build();
    }

    /** Um atalho por crianca no menu do icone; os fixados na tela tambem ganham o rosto novo. */
    @PluginMethod
    public void atualizar(PluginCall call) {
        try {
            JSArray perfis = call.getArray("perfis");
            List<ShortcutInfoCompat> lista = new ArrayList<>();
            Set<String> vivos = new HashSet<>();
            for (int i = 0; i < perfis.length(); i++) {
                JSONObject p = perfis.getJSONObject(i);
                ShortcutInfoCompat s = atalho(p.getString("id"), p.getString("nome"), p.getString("icone"));
                lista.add(s);
                vivos.add(s.getId());
            }
            int max = ShortcutManagerCompat.getMaxShortcutCountPerActivity(getContext());
            ShortcutManagerCompat.setDynamicShortcuts(getContext(), lista.subList(0, Math.min(max, lista.size())));
            ShortcutManagerCompat.updateShortcuts(getContext(), lista);
            // perfil apagado: o atalho fixado na tela fica cinza, com o aviso
            List<String> mortos = new ArrayList<>();
            for (ShortcutInfoCompat s : ShortcutManagerCompat.getShortcuts(getContext(), ShortcutManagerCompat.FLAG_MATCH_PINNED)) {
                if (!vivos.contains(s.getId())) mortos.add(s.getId());
            }
            if (!mortos.isEmpty()) ShortcutManagerCompat.disableShortcuts(getContext(), mortos, "Este personagem foi apagado");
            call.resolve();
        } catch (Exception e) {
            call.reject("nao deu para atualizar os atalhos", e);
        }
    }

    /** Pede ao Android para por o rosto da crianca na tela inicial (o adulto confirma). */
    @PluginMethod
    public void fixar(PluginCall call) {
        JSObject r = new JSObject();
        if (!ShortcutManagerCompat.isRequestPinShortcutSupported(getContext())) {
            r.put("ok", false);
            call.resolve(r);
            return;
        }
        ShortcutInfoCompat s = atalho(call.getString("id", ""), call.getString("nome", ""), call.getString("icone", ""));
        r.put("ok", ShortcutManagerCompat.requestPinShortcut(getContext(), s, null));
        call.resolve(r);
    }

    /** O perfil do atalho que abriu o app (uma vez so). */
    @PluginMethod
    public void pedido(PluginCall call) {
        Intent i = getActivity().getIntent();
        JSObject r = new JSObject();
        if (i != null && i.hasExtra(EXTRA_PERFIL)) {
            r.put("id", i.getStringExtra(EXTRA_PERFIL));
            i.removeExtra(EXTRA_PERFIL);
        }
        call.resolve(r);
    }

    /** O app ja estava aberto e outra crianca tocou no rosto dela. */
    @Override
    protected void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);
        if (intent == null || !intent.hasExtra(EXTRA_PERFIL)) return;
        JSObject r = new JSObject();
        r.put("id", intent.getStringExtra(EXTRA_PERFIL));
        notifyListeners("perfil", r);
    }
}
