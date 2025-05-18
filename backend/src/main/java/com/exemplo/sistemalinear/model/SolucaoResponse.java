package com.exemplo.sistemalinear.model;

public class SolucaoResponse {
    private double[] solucao;

    public SolucaoResponse(double[] solucao) {
        this.solucao = solucao;
    }

    public double[] getSolucao() {
        return solucao;
    }

    public void setSolucao(double[] solucao) {
        this.solucao = solucao;
    }
}
