package com.yjq.programmer.service;

import com.yjq.programmer.dto.LikeDTO;
import com.yjq.programmer.dto.ResponseDTO;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-18 15:14
 */
public interface ILikeService {

    // 点赞文章
    ResponseDTO<Boolean> likeArticle(LikeDTO likeDTO);

    // 取消点赞文章
    ResponseDTO<Boolean> unlikeArticle(LikeDTO likeDTO);

    // 判断是否喜欢文章
    ResponseDTO<Boolean> judgeLike(LikeDTO likeDTO);

}
