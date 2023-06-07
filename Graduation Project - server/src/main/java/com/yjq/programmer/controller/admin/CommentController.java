package com.yjq.programmer.controller.admin;

import com.yjq.programmer.dto.ArticleDTO;
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
 * @create 2023-02-21 15:48
 */
@RestController("AdminCommentController")
@RequestMapping("/admin/comment")
public class CommentController {

    @Resource
    private ICommentService commentService;

    /**
     * 分页获取评论数据
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<CommentDTO>> getCommentList(@RequestBody PageDTO<CommentDTO> pageDTO){
        return commentService.getCommentListByAdmin(pageDTO);
    }

    /**
     * 删除评论信息
     * @param commentDTO
     * @return
     */
    @PostMapping("/delete")
    public ResponseDTO<Boolean> deleteComment(@RequestBody CommentDTO commentDTO){
        return commentService.deleteComment(commentDTO);
    }

    /**
     * 获取评论总数
     * @return
     */
    @PostMapping("/total")
    public ResponseDTO<Integer> getCommentTotal(){
        return commentService.getCommentTotal();
    }
}
