package com.yjq.programmer.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yjq.programmer.bean.CodeMsg;
import com.yjq.programmer.dao.*;
import com.yjq.programmer.dao.my.MyArticleMapper;
import com.yjq.programmer.domain.*;
import com.yjq.programmer.dto.*;
import com.yjq.programmer.enums.ArticleQueryTypeEnum;
import com.yjq.programmer.enums.ArticleStateEnum;
import com.yjq.programmer.enums.ArticleTypeEnum;
import com.yjq.programmer.service.IArticleService;
import com.yjq.programmer.service.ITagService;
import com.yjq.programmer.utils.CommonUtil;
import com.yjq.programmer.utils.CopyUtil;
import com.yjq.programmer.utils.UuidUtil;
import com.yjq.programmer.utils.ValidateEntityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-16 16:01
 */
@Transactional
@Service
public class ArticleServiceImpl implements IArticleService {

    @Resource
    private ArticleMapper articleMapper;

    @Resource
    private ITagService tagService;

    @Resource
    private UserMapper userMapper;

    @Resource
    private LikeMapper likeMapper;

    @Resource
    private CollectMapper collectMapper;

    @Resource
    private MyArticleMapper myArticleMapper;

    @Resource
    private TagItemMapper tagItemMapper;

    @Resource
    private TagMapper tagMapper;

    @Resource
    private CategoryMapper categoryMapper;

    @Resource
    private CommentMapper commentMapper;

    /**
     * 保存文章信息
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<ArticleDTO> saveArticle(ArticleDTO articleDTO) {
        // 进行统一表单验证
        CodeMsg validate = ValidateEntityUtil.validate(articleDTO);
        if (!validate.getCode().equals(CodeMsg.SUCCESS.getCode())) {
            return ResponseDTO.errorByMsg(validate);
        }
        // 获取文章的所属标签
        if(articleDTO.getTagList() == null || articleDTO.getTagList().length() == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_TAG_EMPTY);
        }
        String[] splitTag = articleDTO.getTagList().split(";");
        if(splitTag.length > 3) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_TAG_OVER);
        }
        TagItemDTO tagItemDTO = new TagItemDTO();
        tagItemDTO.setTagIdList(splitTag);
        Article article = CopyUtil.copy(articleDTO, Article.class);
        if(CommonUtil.isEmpty(article.getId())) {
            // 添加操作
            article.setId(UuidUtil.getShortUuid());
            tagItemDTO.setArticleId(article.getId());
            tagService.saveTagItem(tagItemDTO);
            article.setCreateTime(new Date());
            article.setUpdateTime(new Date());
            if(articleMapper.insertSelective(article) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_ADD_ERROR);
            }
        } else {
            // 修改操作
            tagItemDTO.setArticleId(article.getId());
            tagService.saveTagItem(tagItemDTO);
            article.setUpdateTime(new Date());
            if(articleMapper.updateByPrimaryKeySelective(article) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_EDIT_ERROR);
            }
        }
        ResponseDTO<ArticleDTO> responseDTO = getArticleById(CopyUtil.copy(article, ArticleDTO.class));
        if(!CodeMsg.SUCCESS.getCode().equals(responseDTO.getCode())) {
            return responseDTO;
        } else {
            return ResponseDTO.successByMsg(CopyUtil.copy(responseDTO.getData(), ArticleDTO.class), "保存文章信息成功！");
        }
    }

    /**
     * 分页获取文章数据
     * @param pageDTO
     * @return
     */
    @Override
    public ResponseDTO<PageDTO<ArticleDTO>> getArticleList(PageDTO<ArticleDTO> pageDTO) {
        ArticleExample articleExample = new ArticleExample();
        // 不知道当前页多少，默认为第一页
        if(pageDTO.getPage() == null){
            pageDTO.setPage(1);
        }
        // 不知道每页多少条记录，默认为每页5条记录
        if(pageDTO.getSize() == null){
            pageDTO.setSize(5);
        }
        ArticleExample.Criteria c1 = articleExample.createCriteria();
        if(pageDTO.getParam() != null) {
            ArticleDTO articleDTO = pageDTO.getParam();
            if(!CommonUtil.isEmpty(articleDTO.getCategoryId()) && !"0".equals(articleDTO.getCategoryId())) {
                c1.andCategoryIdEqualTo(articleDTO.getCategoryId());
            }
            if(!CommonUtil.isEmpty(articleDTO.getTitle())) {
                c1.andTitleLike("%" + articleDTO.getTitle() + "%");
            }
            if(articleDTO.getType() != null && articleDTO.getType() != 0) {
                c1.andTypeEqualTo(articleDTO.getType());
            }
            if(articleDTO.getState() != null && articleDTO.getState() != 0) {
                c1.andStateEqualTo(articleDTO.getState());
            }
            if(articleDTO.getState() == null) {
                List<Integer> stateList = new ArrayList<>();
                stateList.add(ArticleStateEnum.WAIT.getCode());
                stateList.add(ArticleStateEnum.DRAFT.getCode());
                stateList.add(ArticleStateEnum.FAIL.getCode());
                c1.andStateNotIn(stateList);
            }
            if(!CommonUtil.isEmpty(articleDTO.getUserId())
                    && !ArticleQueryTypeEnum.LIKE.getCode().equals(articleDTO.getQueryType())
                    && !ArticleQueryTypeEnum.COLLECT.getCode().equals(articleDTO.getQueryType())) {
                c1.andUserIdEqualTo(articleDTO.getUserId());
            }
            if(ArticleQueryTypeEnum.BLOG.getCode().equals(articleDTO.getQueryType())) {
                c1.andTypeEqualTo(ArticleTypeEnum.BLOG.getCode());
            }
            if(ArticleQueryTypeEnum.FORUM.getCode().equals(articleDTO.getQueryType())) {
                c1.andTypeEqualTo(ArticleTypeEnum.FORUM.getCode());
            }
            if(ArticleQueryTypeEnum.LIKE.getCode().equals(articleDTO.getQueryType())) {
                LikeExample likeExample = new LikeExample();
                likeExample.createCriteria().andUserIdEqualTo(articleDTO.getUserId());
                List<Like> likeList = likeMapper.selectByExample(likeExample);
                List<String> articleIdList = likeList.stream().map(Like::getArticleId).collect(Collectors.toList());
                if(articleIdList.size() == 0) {
                    articleIdList.add("-1");
                }
                c1.andIdIn(articleIdList);
            }
            if(ArticleQueryTypeEnum.COLLECT.getCode().equals(articleDTO.getQueryType())) {
                CollectExample collectExample = new CollectExample();
                collectExample.createCriteria().andUserIdEqualTo(articleDTO.getUserId());
                List<Collect> collectList = collectMapper.selectByExample(collectExample);
                List<String> articleIdList = collectList.stream().map(Collect::getArticleId).collect(Collectors.toList());
                if(articleIdList.size() == 0) {
                    articleIdList.add("-1");
                }
                c1.andIdIn(articleIdList);
            }
        }
        articleExample.setOrderByClause("top desc, essence desc, official desc, create_time desc");
        PageHelper.startPage(pageDTO.getPage(), pageDTO.getSize());
        // 分页查出文章数据
        List<Article> articleList = articleMapper.selectByExample(articleExample);
        PageInfo<Article> pageInfo = new PageInfo<>(articleList);
        // 获取数据的总数
        pageDTO.setTotal(pageInfo.getTotal());
        // 讲domain类型数据  转成 DTO类型数据
        List<ArticleDTO> articleDTOList = CopyUtil.copyList(articleList, ArticleDTO.class);
        for(ArticleDTO articleDTO : articleDTOList) {
            // 获取文章所属用户信息
            User user = userMapper.selectByPrimaryKey(articleDTO.getUserId());
            articleDTO.setUserDTO(CopyUtil.copy(user, UserDTO.class));
            // 获取文章所属标签信息
            TagItemExample tagItemExample = new TagItemExample();
            tagItemExample.createCriteria().andArticleIdEqualTo(articleDTO.getId());
            List<TagItem> tagItemList = tagItemMapper.selectByExample(tagItemExample);
            List<String> tagIdList = tagItemList.stream().map(TagItem::getTagId).collect(Collectors.toList());
            List<Tag> tagList;
            if(tagIdList.size() == 0) {
                tagList = new ArrayList<>();
            } else {
                TagExample tagExample = new TagExample();
                tagExample.createCriteria().andIdIn(tagIdList);
                tagList = tagMapper.selectByExample(tagExample);
            }
            articleDTO.setTagDTOList(CopyUtil.copyList(tagList, TagDTO.class));
            // 获取文章所属分类信息
            Category category = categoryMapper.selectByPrimaryKey(articleDTO.getCategoryId());
            if(category == null) {
                articleDTO.setCategoryDTO(CopyUtil.copy(new Category(), CategoryDTO.class));
            } else {
                articleDTO.setCategoryDTO(CopyUtil.copy(category, CategoryDTO.class));
            }
        }
        pageDTO.setList(articleDTOList);
        return ResponseDTO.success(pageDTO);
    }

    /**
     * 根据文章id获取文章信息
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<ArticleDTO> getArticleById(ArticleDTO articleDTO) {
        if(CommonUtil.isEmpty(articleDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = articleMapper.selectByPrimaryKey(articleDTO.getId());
        if(article == null) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        ArticleDTO articleDTODB = CopyUtil.copy(article, ArticleDTO.class);
        // 获取文章所属用户信息
        User user = userMapper.selectByPrimaryKey(articleDTODB.getUserId());
        articleDTODB.setUserDTO(CopyUtil.copy(user, UserDTO.class));
        // 获取文章所属标签信息
        TagItemExample tagItemExample = new TagItemExample();
        tagItemExample.createCriteria().andArticleIdEqualTo(articleDTODB.getId());
        List<TagItem> tagItemList = tagItemMapper.selectByExample(tagItemExample);
        List<String> tagIdList = tagItemList.stream().map(TagItem::getTagId).collect(Collectors.toList());
        List<Tag> tagList = new ArrayList<>();
        if(tagItemList.size() > 0) {
            TagExample tagExample = new TagExample();
            tagExample.createCriteria().andIdIn(tagIdList);
            tagList = tagMapper.selectByExample(tagExample);
        }
        articleDTODB.setTagDTOList(CopyUtil.copyList(tagList, TagDTO.class));
        // 获取文章所属分类信息
        Category category = categoryMapper.selectByPrimaryKey(articleDTODB.getCategoryId());
        if(category == null) {
            articleDTODB.setCategoryDTO(CopyUtil.copy(new Category(), CategoryDTO.class));
        } else {
            articleDTODB.setCategoryDTO(CopyUtil.copy(category, CategoryDTO.class));
        }
        return ResponseDTO.success(articleDTODB);
    }

    /**
     * 浏览文章详情信息
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<ArticleDTO> viewArticle(ArticleDTO articleDTO) {
        // 增加文章访问量
        Article article = articleMapper.selectByPrimaryKey(articleDTO.getId());
        article.setViewNum(article.getViewNum() + 1);
        articleMapper.updateByPrimaryKeySelective(article);
        ResponseDTO<ArticleDTO> responseDTO = getArticleById(articleDTO);
        return responseDTO;
    }

    /**
     * 查询热门文章
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<List<ArticleDTO>> getHotArticleList(ArticleDTO articleDTO) {
        ArticleExample articleExample = new ArticleExample();
        List<Integer> stateList = new ArrayList<>();
        stateList.add(ArticleStateEnum.WAIT.getCode());
        stateList.add(ArticleStateEnum.DRAFT.getCode());
        stateList.add(ArticleStateEnum.FAIL.getCode());
        if(articleDTO.getType() != null) {
            articleExample.createCriteria().andTypeEqualTo(articleDTO.getType()).andStateNotIn(stateList);
        } else {
            articleExample.createCriteria().andStateNotIn(stateList);
        }
        articleExample.setOrderByClause("view_num desc, like_num desc, comment_num desc");
        PageHelper.startPage(1, 5);
        List<Article> articleList = articleMapper.selectByExample(articleExample);
        List<ArticleDTO> articleDTOList = CopyUtil.copyList(articleList, ArticleDTO.class);
        return ResponseDTO.success(articleDTOList);
    }

    /**
     * 修改文章信息
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> updateArticleInfo(ArticleDTO articleDTO) {
        if(CommonUtil.isEmpty(articleDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = CopyUtil.copy(articleDTO,  Article.class);
        if(articleMapper.updateByPrimaryKeySelective(article) == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_EDIT_ERROR);
        }
        return ResponseDTO.successByMsg(true, "修改文章信息成功！");
    }

    /**
     * 删除文章信息
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> deleteArticle(ArticleDTO articleDTO) {
        if(CommonUtil.isEmpty(articleDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        String[] ids = articleDTO.getId().split(",");
        for(String id : ids) {
            // 删除标签详情信息
            TagItemExample tagItemExample = new TagItemExample();
            tagItemExample.createCriteria().andArticleIdEqualTo(articleDTO.getId());
            tagItemMapper.deleteByExample(tagItemExample);
            // 删除此文章下的评论信息
            CommentExample commentExample = new CommentExample();
            commentExample.createCriteria().andArticleIdEqualTo(articleDTO.getId());
            commentMapper.deleteByExample(commentExample);
            // 删除和此文章有关的喜欢信息
            LikeExample likeExample = new LikeExample();
            likeExample.createCriteria().andArticleIdEqualTo(articleDTO.getId());
            likeMapper.deleteByExample(likeExample);
            // 删除和此文章有关的收藏信息
            CollectExample collectExample = new CollectExample();
            collectExample.createCriteria().andArticleIdEqualTo(articleDTO.getId());
            collectMapper.deleteByExample(collectExample);
            // 删除文章信息
            if(articleMapper.deleteByPrimaryKey(id) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_DELETE_ERROR);
            }
        }
        return ResponseDTO.successByMsg(true, "删除文章信息成功！");
    }

    /**
     * 查询作者的其他文章
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<List<ArticleDTO>> getAuthorArticleList(ArticleDTO articleDTO) {
        if(CommonUtil.isEmpty(articleDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        Article article = articleMapper.selectByPrimaryKey(articleDTO.getId());
        ArticleExample articleExample = new ArticleExample();
        List<Integer> stateList = new ArrayList<>();
        stateList.add(ArticleStateEnum.WAIT.getCode());
        stateList.add(ArticleStateEnum.DRAFT.getCode());
        stateList.add(ArticleStateEnum.FAIL.getCode());
        articleExample.createCriteria().andUserIdEqualTo(article.getUserId()).andStateNotIn(stateList);
        PageHelper.startPage(1, 5);
        List<Article> articleList = articleMapper.selectByExample(articleExample);
        List<ArticleDTO> articleDTOList = CopyUtil.copyList(articleList, ArticleDTO.class);
        return ResponseDTO.success(articleDTOList);
    }

    /**
     * 获取文章总数
     * @param articleDTO
     * @return
     */
    @Override
    public ResponseDTO<Integer> getArticleTotal(ArticleDTO articleDTO) {
        ArticleExample articleExample = new ArticleExample();
        if(articleDTO.getType() != null) {
            articleExample.createCriteria().andTypeEqualTo(articleDTO.getType());
        }
        return ResponseDTO.success(articleMapper.countByExample(articleExample));
    }

    /**
     * 根据日期时间获取文章总数
     * @return
     */
    @Override
    public ResponseDTO<List<Integer>> getArticleTotalByDay() {
        List<Integer> totalList = new ArrayList<>();
        Map<String, Object> queryMap = new HashMap<>();
        // 获取前天已完成的收益次数
        queryMap.put("start", 2);
        queryMap.put("end", 1);
        totalList.add(myArticleMapper.getArticleTotalByDate(queryMap));
        // 获取昨天已完成的收益次数
        queryMap.put("start", 1);
        queryMap.put("end", 0);
        totalList.add(myArticleMapper.getArticleTotalByDate(queryMap));
        // 获取当天已完成的收益次数
        queryMap.put("start", 0);
        queryMap.put("end", -1);
        totalList.add(myArticleMapper.getArticleTotalByDate(queryMap));
        return ResponseDTO.success(totalList);
    }

}
