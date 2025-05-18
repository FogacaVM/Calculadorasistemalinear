package com.exemplo.sistemalinear.model;

public class SistemaRequest {
    private double[][] matriz;
    private double[] termos;

    public double[][] getMatriz() {
        return matriz;
    }

    public void setMatriz(double[][] matriz) {
        this.matriz = matriz;
    }

    public double[] getTermos() {
        return termos;
    }

    public void setTermos(double[] termos) {
        this.termos = termos;
    }
}
