package com.yjq.programmer.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yjq.programmer.bean.CodeMsg;
import com.yjq.programmer.dao.ArticleMapper;
import com.yjq.programmer.dao.CommentMapper;
import com.yjq.programmer.dao.UserMapper;
import com.yjq.programmer.domain.Article;
import com.yjq.programmer.domain.Comment;
import com.yjq.programmer.domain.CommentExample;
import com.yjq.programmer.domain.User;
import com.yjq.programmer.dto.*;
import com.yjq.programmer.enums.ArticleStateEnum;
import com.yjq.programmer.enums.CommentPickEnum;
import com.yjq.programmer.service.ICommentService;
import com.yjq.programmer.utils.CommonUtil;
import com.yjq.programmer.utils.CopyUtil;
import com.yjq.programmer.utils.UuidUtil;
import com.yjq.programmer.utils.ValidateEntityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-18 9:41
 */
@Service
@Transactional
public class CommentServiceImpl implements ICommentService {

    @Resource
    private CommentMapper commentMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private ArticleMapper articleMapper;

    /**
     * 发表评论信息
     * @param commentDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> submitComment(CommentDTO commentDTO) {
        // 进行统一表单验证
        CodeMsg validate = ValidateEntityUtil.validate(commentDTO);
        if (!validate.getCode().equals(CodeMsg.SUCCESS.getCode())) {
            return ResponseDTO.errorByMsg(validate);
        }
        Article article = articleMapper.selectByPrimaryKey(commentDTO.getArticleId());
        if(article == null) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        Comment comment = CopyUtil.copy(commentDTO, Comment.class);
        comment.setId(UuidUtil.getShortUuid());
        comment.setCreateTime(new Date());
        if(commentMapper.insertSelective(comment) == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.COMMENT_SUBMIT_ERROR);
        }
        // 增加文章评论数
        article.setCommentNum(article.getCommentNum() + 1);
        articleMapper.updateByPrimaryKeySelective(article);

        return ResponseDTO.successByMsg(true, "评论发表成功！");
    }

    /**
     * 分页获取评论信息
     * @param pageDTO
     * @return
     */
    @Override
    public ResponseDTO<PageDTO<CommentDTO>> getCommentList(PageDTO<CommentDTO> pageDTO) {
        CommentExample commentExample = new CommentExample();
        // 不知道当前页多少，默认为第一页
        if(pageDTO.getPage() == null){
            pageDTO.setPage(1);
        }
        // 不知道每页多少条记录，默认为每页5条记录
        if(pageDTO.getSize() == null){
            pageDTO.setSize(5);
        }
        // 先查出一级评论
        if(pageDTO.getParam() != null) {
            CommentDTO commentDTO = pageDTO.getParam();
            commentExample.createCriteria().andParentIdEqualTo("").andArticleIdEqualTo(commentDTO.getArticleId());
        }
        commentExample.setOrderByClause("pick desc, create_time desc");
        PageHelper.startPage(pageDTO.getPage(), pageDTO.getSize());
        // 分页查出评论数据
        List<Comment> commentList = commentMapper.selectByExample(commentExample);
        PageInfo<Comment> pageInfo = new PageInfo<>(commentList);
        // 获取数据的总数
        pageDTO.setTotal(pageInfo.getTotal());
        int pickIndex = 0;
        int nowIndex = -1;
        // 讲domain类型数据  转成 DTO类型数据
        List<CommentDTO> commentDTOList = CopyUtil.copyList(commentList, CommentDTO.class);
        for(CommentDTO commentDTO : commentDTOList) {
            nowIndex++;
            // 查询评论用户信息
            User fromUser = userMapper.selectByPrimaryKey(commentDTO.getFromId());
            commentDTO.setFromUserDTO(CopyUtil.copy(fromUser, UserDTO.class));
            User toUser = userMapper.selectByPrimaryKey(commentDTO.getToId());
            commentDTO.setToUserDTO(CopyUtil.copy(toUser, UserDTO.class));
            // 默认折叠
            commentDTO.setCollapse(true);
            // 查询子评论
            CommentExample childrenCommentExample = new CommentExample();
            childrenCommentExample.createCriteria().andParentIdEqualTo(commentDTO.getId());
            childrenCommentExample.setOrderByClause("pick desc, create_time desc");
            List<Comment> childrenCommentList = commentMapper.selectByExample(childrenCommentExample);
            List<CommentDTO> childrenCommentDTOList = CopyUtil.copyList(childrenCommentList, CommentDTO.class);
            for(CommentDTO childrenCommentDTO : childrenCommentDTOList) {
                User fromChildrenUser = userMapper.selectByPrimaryKey(childrenCommentDTO.getFromId());
                childrenCommentDTO.setFromUserDTO(CopyUtil.copy(fromChildrenUser, UserDTO.class));
                User toChildrenUser = userMapper.selectByPrimaryKey(childrenCommentDTO.getToId());
                childrenCommentDTO.setToUserDTO(CopyUtil.copy(toChildrenUser, UserDTO.class));
                if(CommentPickEnum.YES.getCode().equals(childrenCommentDTO.getPick())) {
                    // 如果子评论被采纳，父评论默认展开
                    commentDTO.setCollapse(false);
                    pickIndex = nowIndex;
                }
            }
            commentDTO.setChildrenList(childrenCommentDTOList);
        }
        if(pickIndex != 0) {
            // 换位，采纳的评论置顶
            commentDTOList.add(0, commentDTOList.remove(pickIndex));
        }
        pageDTO.setList(commentDTOList);
        return ResponseDTO.success(pageDTO);
    }

    /**
     * 后台分页获取评论信息
     * @param pageDTO
     * @return
     */
    @Override
    public ResponseDTO<PageDTO<CommentDTO>> getCommentListByAdmin(PageDTO<CommentDTO> pageDTO) {
        CommentExample commentExample = new CommentExample();
        // 不知道当前页多少，默认为第一页
        if(pageDTO.getPage() == null){
            pageDTO.setPage(1);
        }
        // 不知道每页多少条记录，默认为每页5条记录
        if(pageDTO.getSize() == null){
            pageDTO.setSize(5);
        }
        // 先查出一级评论
        if(pageDTO.getParam() != null) {
            CommentDTO commentDTO = pageDTO.getParam();
            if(!CommonUtil.isEmpty(commentDTO.getContent())) {
                commentExample.createCriteria().andContentLike("%" + commentDTO.getContent() + "%");
            }
        }
        commentExample.setOrderByClause("create_time desc");
        PageHelper.startPage(pageDTO.getPage(), pageDTO.getSize());
        // 分页查出评论数据
        List<Comment> commentList = commentMapper.selectByExample(commentExample);
        PageInfo<Comment> pageInfo = new PageInfo<>(commentList);
        // 获取数据的总数
        pageDTO.setTotal(pageInfo.getTotal());
        // 讲domain类型数据  转成 DTO类型数据
        List<CommentDTO> commentDTOList = CopyUtil.copyList(commentList, CommentDTO.class);
        for(CommentDTO commentDTO : commentDTOList) {
            // 查询评论用户信息
            User fromUser = userMapper.selectByPrimaryKey(commentDTO.getFromId());
            commentDTO.setFromUserDTO(CopyUtil.copy(fromUser, UserDTO.class));
            User toUser = userMapper.selectByPrimaryKey(commentDTO.getToId());
            commentDTO.setToUserDTO(CopyUtil.copy(toUser, UserDTO.class));
            // 查询评论文章信息
            Article article = articleMapper.selectByPrimaryKey(commentDTO.getArticleId());
            commentDTO.setArticleDTO(CopyUtil.copy(article, ArticleDTO.class));
        }

        pageDTO.setList(commentDTOList);
        return ResponseDTO.success(pageDTO);
    }

    /**
     * 删除评论数据
     * @param commentDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> deleteComment(CommentDTO commentDTO) {
        if(CommonUtil.isEmpty(commentDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        String[] ids = commentDTO.getId().split(",");
        for(String id : ids) {
            Comment comment = commentMapper.selectByPrimaryKey(id);
            // 删除子评论
            CommentExample commentExample = new CommentExample();
            commentExample.createCriteria().andParentIdEqualTo(id);
            commentMapper.deleteByExample(commentExample);
            // 删除评论信息
            if(commentMapper.deleteByPrimaryKey(id) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.COMMENT_DELETE_ERROR);
            }
            // 减少评论数
            Article article = articleMapper.selectByPrimaryKey(comment.getArticleId());
            CommentExample commentCountExample = new CommentExample();
            commentCountExample.createCriteria().andArticleIdEqualTo(article.getId());
            article.setCommentNum(commentMapper.countByExample(commentCountExample));
            articleMapper.updateByPrimaryKeySelective(article);
        }
        return ResponseDTO.successByMsg(true, "删除评论信息成功！");
    }

    /**
     * 根据文章获取评论总数
     * @return
     */
    @Override
    public ResponseDTO<Integer> countTotalComment(CommentDTO commentDTO) {
        if(CommonUtil.isEmpty(commentDTO.getArticleId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        CommentExample commentExample = new CommentExample();
        commentExample.createCriteria().andArticleIdEqualTo(commentDTO.getArticleId());
        return ResponseDTO.success(commentMapper.countByExample(commentExample));
    }

    /**
     * 采纳评论
     * @param commentDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> pickComment(CommentDTO commentDTO) {
        if(CommonUtil.isEmpty(commentDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Comment comment = commentMapper.selectByPrimaryKey(commentDTO.getId());
        if(comment == null) {
            return ResponseDTO.errorByMsg(CodeMsg.COMMENT_NOT_EXIST);
        }
        Article article = articleMapper.selectByPrimaryKey(comment.getArticleId());
        if(article == null) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        comment.setPick(CommentPickEnum.YES.getCode());
        if(commentMapper.updateByPrimaryKeySelective(comment) == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.COMMENT_PICK_ERROR);
        }
        // 修改文章状态
        article.setState(ArticleStateEnum.SOLVE.getCode());
        articleMapper.updateByPrimaryKeySelective(article);
        return ResponseDTO.successByMsg(true, "采纳评论成功！");
    }

    /**
     * 获取评论总数
     * @return
     */
    @Override
    public ResponseDTO<Integer> getCommentTotal() {
        return ResponseDTO.success(commentMapper.countByExample(new CommentExample()));
    }
}
