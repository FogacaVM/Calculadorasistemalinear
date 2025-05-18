package com.exemplo.sistemalinear.model;

import java.util.List;

public class SolucaoResponse {
    private List<Double> solucao;
    private String mensagem;

    public SolucaoResponse() {}

    public SolucaoResponse(List<Double> solucao, String mensagem) {
        this.solucao = solucao;
        this.mensagem = mensagem;
    }

    public List<Double> getSolucao() {
        return solucao;
    }

    public void setSolucao(List<Double> solucao) {
        this.solucao = solucao;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
}
