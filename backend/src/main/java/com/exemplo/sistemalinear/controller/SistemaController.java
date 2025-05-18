package com.exemplo.sistemalinear.controller;

import com.exemplo.sistemalinear.model.SistemaRequest;
import com.exemplo.sistemalinear.model.SolucaoResponse;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5500")  // Atualize para a porta onde seu front está rodando
public class SistemaController {

    @PostMapping("/resolver")
    public SolucaoResponse resolver(@RequestBody SistemaRequest request) {
        double[][] A = request.getMatriz();
        double[] b = request.getTermos();

        double[] x = gaussJordan(A, b);

        return new SolucaoResponse(x);
    }

    private double[] gaussJordan(double[][] A, double[] b) {
        int n = b.length;

        for (int p = 0; p < n; p++) {
            // Busca linha com maior valor absoluto na coluna p
            int max = p;
            for (int i = p + 1; i < n; i++) {
                if (Math.abs(A[i][p]) > Math.abs(A[max][p])) {
                    max = i;
                }
            }

            // Troca linhas A[p] e A[max]
            double[] temp = A[p];
            A[p] = A[max];
            A[max] = temp;

            double t = b[p];
            b[p] = b[max];
            b[max] = t;

            // Normaliza linha p
            if (Math.abs(A[p][p]) <= 1e-10) {
                throw new ArithmeticException("Sistema sem solução única");
            }
            double pivot = A[p][p];
            for (int j = p; j < n; j++) {
                A[p][j] /= pivot;
            }
            b[p] /= pivot;

            // Elimina outras linhas
            for (int i = 0; i < n; i++) {
                if (i != p) {
                    double factor = A[i][p];
                    for (int j = p; j < n; j++) {
                        A[i][j] -= factor * A[p][j];
                    }
                    b[i] -= factor * b[p];
                }
            }
        }
        return b;
    }
}
