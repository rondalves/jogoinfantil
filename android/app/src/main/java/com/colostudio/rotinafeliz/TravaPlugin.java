package com.colostudio.rotinafeliz;

import android.content.Intent;
import android.provider.Settings;
import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * A trava da area dos adultos: o bloqueio de tela do proprio celular
 * (digital, rosto, PIN, padrao ou senha). Quem confere e o Android; o jogo
 * so recebe { ok: true } ou { ok: false } e nunca ve a digital nem a senha.
 * O lado do jogo esta em src/portaoAdulto.ts.
 *
 * { semBloqueio: true }: o celular nao tem bloqueio de tela configurado, e a
 * area fica fechada ate o adulto configurar um.
 */
@CapacitorPlugin(name = "Trava")
public class TravaPlugin extends Plugin {
    // BIOMETRIC_WEAK com DEVICE_CREDENTIAL e a unica combinacao com bloqueio
    // de tela que funciona do Android 7 em diante
    private static final int QUEM =
        BiometricManager.Authenticators.BIOMETRIC_WEAK | BiometricManager.Authenticators.DEVICE_CREDENTIAL;

    @PluginMethod
    public void confirmar(PluginCall call) {
        if (BiometricManager.from(getContext()).canAuthenticate(QUEM) != BiometricManager.BIOMETRIC_SUCCESS) {
            JSObject r = new JSObject();
            r.put("ok", false);
            r.put("semBloqueio", true);
            call.resolve(r);
            return;
        }
        getActivity().runOnUiThread(() -> {
            BiometricPrompt prompt = new BiometricPrompt(
                getActivity(),
                ContextCompat.getMainExecutor(getContext()),
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        responder(call, true);
                    }

                    @Override
                    public void onAuthenticationError(int codigo, @NonNull CharSequence msg) {
                        // cancelou, desistiu ou errou demais: o proprio Android avisa
                        responder(call, false);
                    }
                    // onAuthenticationFailed (digital errada) nao encerra: o dialogo deixa tentar de novo
                }
            );
            // com bloqueio de tela permitido, o Android poe o botao "usar PIN" no lugar do cancelar
            prompt.authenticate(
                new BiometricPrompt.PromptInfo.Builder()
                    .setTitle("Área dos adultos")
                    .setSubtitle("Use a digital ou o bloqueio deste celular")
                    .setAllowedAuthenticators(QUEM)
                    .build()
            );
        });
    }

    /** Abre a tela do Android onde se cria o bloqueio de tela. */
    @PluginMethod
    public void abrirAjustes(PluginCall call) {
        Intent i = new Intent(Settings.ACTION_SECURITY_SETTINGS);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(i);
        call.resolve();
    }

    private void responder(PluginCall call, boolean ok) {
        JSObject r = new JSObject();
        r.put("ok", ok);
        call.resolve(r);
    }
}
