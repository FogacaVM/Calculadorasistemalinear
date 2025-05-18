package com.exemplo.sistemalinear.controller;

import com.exemplo.sistemalinear.model.SistemaRequest;
import com.exemplo.sistemalinear.model.SolucaoResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/resolver")
@CrossOrigin(origins = "*")
public class SistemaController {

    @PostMapping
    public SolucaoResponse resolver(@RequestBody SistemaRequest request) {
        List<List<Double>> A = request.getMatriz();
        List<Double> B = request.getTermos();

        int n = A.size();

        // Validação
        if (B.size() != n || A.stream().anyMatch(row -> row.size() != n)) {
            return new SolucaoResponse(null, "Matriz inválida");
        }

        // Conversão para arrays
        double[][] matriz = new double[n][n];
        double[] termos = new double[n];

        for (int i = 0; i < n; i++) {
            termos[i] = B.get(i);
            for (int j = 0; j < n; j++) {
                matriz[i][j] = A.get(i).get(j);
            }
        }

        // Substituição gaussiana
        for (int i = 0; i < n; i++) {
            if (matriz[i][i] == 0.0) return new SolucaoResponse(null, "O sistema não possui solução ou é indeterminado.");

            for (int j = i + 1; j < n; j++) {
                double ratio = matriz[j][i] / matriz[i][i];

                for (int k = 0; k < n; k++) {
                    matriz[j][k] -= ratio * matriz[i][k];
                }
                termos[j] -= ratio * termos[i];
            }
        }

        // Verificação de sistema impossível ou indeterminado
        for (int i = 0; i < n; i++) {
            boolean zeroRow = true;
            for (int j = 0; j < n; j++) {
                if (Math.abs(matriz[i][j]) > 1e-8) {
                    zeroRow = false;
                    break;
                }
            }
            if (zeroRow && Math.abs(termos[i]) > 1e-8) {
                return new SolucaoResponse(null, "O sistema não possui solução.");
            }
            if (zeroRow && Math.abs(termos[i]) <= 1e-8) {
                return new SolucaoResponse(null, "O sistema é indeterminado.");
            }
        }

        // Substituição regressiva
        double[] resultado = new double[n];
        for (int i = n - 1; i >= 0; i--) {
            resultado[i] = termos[i];
            for (int j = i + 1; j < n; j++) {
                resultado[i] -= matriz[i][j] * resultado[j];
            }
            resultado[i] /= matriz[i][i];
        }

        List<Double> solucao = new ArrayList<>();
        for (double x : resultado) solucao.add(x);

        return new SolucaoResponse(solucao, "Sistema resolvido com sucesso.");
    }
}
