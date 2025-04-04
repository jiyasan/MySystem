package com.example.app.dto;

public class LayoutItem {
    private int row;
    private int col;
    private String type;
    private String name;
    private String color;

    public LayoutItem() {
        // デフォルトコンストラクタ必須（@RequestBody用）
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getCol() {
        return col;
    }

    public void setCol(int col) {
        this.col = col;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    @Override
    public String toString() {
        return "LayoutItem{" +
                "row=" + row +
                ", col=" + col +
                ", type='" + type + '\'' +
                ", name='" + name + '\'' +
                ", color='" + color + '\'' +
                '}';
    }
}
