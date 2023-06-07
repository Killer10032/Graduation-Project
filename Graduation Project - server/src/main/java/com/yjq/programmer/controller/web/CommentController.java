package com.yjq.programmer.controller.web;

import com.yjq.programmer.dto.CommentDTO;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.service.ICommentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-18 9:41
 */
@RestController("WebCommentController")
@RequestMapping("/web/comment")
public class CommentController {

    @Resource
    private ICommentService commentService;

    /**
     * 发表评论信息
     * @param commentDTO
     * @return
     */
    @PostMapping("/submit")
    public ResponseDTO<Boolean> submitComment(@RequestBody CommentDTO commentDTO){
        return commentService.submitComment(commentDTO);
    }

    /**
     * 采纳评论
     * @param commentDTO
     * @return
     */
    @PostMapping("/pick")
    public ResponseDTO<Boolean> pickComment(@RequestBody CommentDTO commentDTO){
        return commentService.pickComment(commentDTO);
    }

    /**
     * 分页获取评论信息
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<CommentDTO>> getCommentList(@RequestBody PageDTO<CommentDTO> pageDTO){
        return commentService.getCommentList(pageDTO);
    }

    /**
     * 删除评论数据
     * @param commentDTO
     * @return
     */
    @PostMapping("/delete")
    public ResponseDTO<Boolean> deleteComment(@RequestBody CommentDTO commentDTO){
        return commentService.deleteComment(commentDTO);
    }

    /**
     * 根据文章获取评论总数
     * @param commentDTO
     * @return
     */
    @PostMapping("/total")
    public ResponseDTO<Integer> countTotalComment(@RequestBody CommentDTO commentDTO){
        return commentService.countTotalComment(commentDTO);
    }


}
