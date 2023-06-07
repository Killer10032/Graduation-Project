package com.yjq.programmer.service;

import com.yjq.programmer.dto.CommentDTO;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-18 9:41
 */
public interface ICommentService {

    // 发表评论信息
    ResponseDTO<Boolean> submitComment(CommentDTO commentDTO);

    // 分页获取评论信息
    ResponseDTO<PageDTO<CommentDTO>> getCommentList(PageDTO<CommentDTO> pageDTO);

    // 后台分页获取评论信息
    ResponseDTO<PageDTO<CommentDTO>> getCommentListByAdmin(PageDTO<CommentDTO> pageDTO);

    // 删除评论数据
    ResponseDTO<Boolean> deleteComment(CommentDTO commentDTO);

    // 根据文章获取评论总数
    ResponseDTO<Integer> countTotalComment(CommentDTO commentDTO);

    // 采纳评论
    ResponseDTO<Boolean> pickComment(CommentDTO commentDTO);

    // 获取评论总数
    ResponseDTO<Integer> getCommentTotal();
}
