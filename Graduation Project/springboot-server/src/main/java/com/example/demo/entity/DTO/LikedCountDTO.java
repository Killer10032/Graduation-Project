package com.example.demo.entity.DTO;

import lombok.Data;

@Data
public class LikedCountDTO {

    private Integer articleId;
    private Integer likedNum;

    public LikedCountDTO(Integer articleId, Integer likedNum) {
        this.articleId = articleId;
        this.likedNum = likedNum;
    }
}
