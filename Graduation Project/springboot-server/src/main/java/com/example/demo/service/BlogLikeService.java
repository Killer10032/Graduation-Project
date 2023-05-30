package com.example.demo.service;

import com.example.demo.entity.BlogLike;
import com.example.demo.entity.DTO.LikedCountDTO;

import java.util.List;


public interface BlogLikeService {

    /**
     * 点赞，状态为1
     * @param userId
     * @param articleId
     */
    void saveLiked2Redis(String articleId, String userId);

    /**
     * 取消点赞，将状态改变为0
     * @param userId
     * @param articleId
     */
    void unlikeFromRedis(String articleId, String userId);

    /**
     * 从Redis中删除一条点赞数据
     * @param userId
     * @param articleId
     */
    void deleteLikedFromRedis(String articleId, String userId);

    /**
     * 该文章点赞数加1
     * @param articleId
     */
    void incrementLikedCount(String articleId);

    /**
     * 该文章点赞数减1
     * @param articleId
     */
    void decrementLikedCount(String articleId);

    /**
     * 获取Redis中存储的所有点赞数据
     * @return
     */
    List<BlogLike> getLikeDateFromRedis();

    /**
     * 获取Redis中存储的所有点赞数量
     * @return
     */
    List<LikedCountDTO> getLikedCountFromRedis();
}
