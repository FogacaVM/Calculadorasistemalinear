package com.exemplo.sistemalinear.model;

import java.util.List;

public class SistemaRequest {
    private List<List<Double>> matriz;
    private List<Double> termos;

    public List<List<Double>> getMatriz() {
        return matriz;
    }

    public void setMatriz(List<List<Double>> matriz) {
        this.matriz = matriz;
    }

    public List<Double> getTermos() {
        return termos;
    }

    public void setTermos(List<Double> termos) {
        this.termos = termos;
    }
}
