package com.example.demo.service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.Util.RedisKeyUtils;
import com.example.demo.entity.BlogLike;
import com.example.demo.entity.DTO.BlogDTO;
import com.example.demo.entity.DTO.LikedCountDTO;
import com.example.demo.mapper.BlogLikeMapper;
import com.example.demo.mapper.BlogMapper;
import com.example.demo.service.BlogLikeService;
import com.example.demo.service.LikedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class LikedServiceImpl implements LikedService {

    @Autowired
    private BlogLikeService blogLikeService;

    @Autowired
    private BlogLikeMapper blogLikeMapper;

    @Autowired
    private BlogMapper blogMapper;

    @Override
    @Transactional
    public void save(BlogLike blogLike) {
        blogLikeMapper.insert(blogLike);
    }

    @Override
    @Transactional
    public void saveAll(List<BlogLike> list) {
        for (BlogLike blog : list) {
            save(blog);
        }
    }

    @Override
    public Page<BlogLike> getLikedListByLikedArticle(Integer articleId) {
        LambdaQueryWrapper<BlogLike> wrapper = Wrappers.lambdaQuery();
        wrapper.eq(BlogLike::getArticleId, articleId);
        return blogLikeMapper.selectPage(new Page<>(), wrapper);
    }

    @Override
    public Page<BlogLike> getLikedListByLikedUserId(Integer userId) {
        LambdaQueryWrapper<BlogLike> wrapper = Wrappers.lambdaQuery();
        wrapper.eq(BlogLike::getUserId, userId);
        return blogLikeMapper.selectPage(new Page<>(), wrapper);
    }

    @Override
    public BlogLike getByLikedArticleIdAndUserId(Integer articleId, Integer userId) {
        LambdaQueryWrapper<BlogLike> wrapper = Wrappers.lambdaQuery();
        wrapper.eq(BlogLike::getArticleId, articleId);
        wrapper.eq(BlogLike::getUserId, userId);
        return blogLikeMapper.selectOne(wrapper);
    }

    @Override
    @Transactional
    public void transLikedFromRedis2DB() {
        List<BlogLike> list = blogLikeService.getLikeDateFromRedis();
        for (BlogLike like : list) {
            BlogLike bl = getByLikedArticleIdAndUserId(like.getArticleId(), like.getUserId());
            if (bl == null) {
                save(like);
            }else {
                bl.setStatus(like.getStatus());
                save(bl);
            }
        }
    }

    @Override
    @Transactional
    public void transLikedCountFromRedis2DB() {
        List<LikedCountDTO> list = blogLikeService.getLikedCountFromRedis();
        for (LikedCountDTO dto : list) {
            BlogDTO blog = blogMapper.selectById(dto.getArticleId());
            if (blog != null) {
                Integer likedNum = dto.getLikedNum();
                blog.setLikedNum(likedNum);
                blogMapper.updateById(blog);
            }
        }
    }
}
