package com.example.demo.service.Impl;

import cn.hutool.core.util.ReUtil;
import com.example.demo.Util.RedisKeyUtils;
import com.example.demo.Util.RedisUtils;
import com.example.demo.entity.BlogLike;
import com.example.demo.entity.DTO.LikedCountDTO;
import com.example.demo.entity.Enum.LikeStatusEnum;
import com.example.demo.service.BlogLikeService;
import com.example.demo.service.LikedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
public class BlogLikeServiceImpl implements BlogLikeService {

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private RedisUtils redisUtils;

    @Autowired
    private LikedService likedService;

    @Override
    public void saveLiked2Redis(String articleId, String userId) {
        String key = RedisKeyUtils.getLikedKey(articleId, userId);
        redisUtils.hmSet(RedisKeyUtils.MAP_KEY_USER_LIKED, key, LikeStatusEnum.LIKE.getCode());
    }

    @Override
    public void unlikeFromRedis(String articleId, String userId) {
        String key = RedisKeyUtils.getLikedKey(articleId, userId);
        redisUtils.hmSet(RedisKeyUtils.MAP_KEY_USER_LIKED, key, LikeStatusEnum.UNLIKE.getCode());
    }

    @Override
    public void deleteLikedFromRedis(String articleId, String userId) {
        String key = RedisKeyUtils.getLikedKey(articleId, userId);
        redisUtils.hmDel(RedisKeyUtils.MAP_KEY_USER_LIKED, key);
    }

    @Override
    public void incrementLikedCount(String articleId) {
        redisTemplate.opsForHash().increment(RedisKeyUtils.MAP_KEY_USER_LIKED_COUNT, articleId, 1);
    }

    @Override
    public void decrementLikedCount(String articleId) {
        redisTemplate.opsForHash().increment(RedisKeyUtils.MAP_KEY_USER_LIKED_COUNT, articleId, -1);
    }

    @Override
    public List<BlogLike> getLikeDateFromRedis() {
        Cursor<Map.Entry<Object, Object>> cursor = redisTemplate.opsForHash().scan(RedisKeyUtils.MAP_KEY_USER_LIKED, ScanOptions.NONE);
        List<BlogLike> list = new ArrayList<>();
        while (cursor.hasNext()) {
            Map.Entry<Object, Object> entry = cursor.next();
            String key = (String) entry.getKey();
            //分离出 articleId, userId
            String[] split = key.split("::");
            Integer articleId = 0;
            if(split[0]!=null){
                articleId = Integer.valueOf(split[0]);
            }
            Integer userId = 0;
            if(split[1]!=null){
                articleId = Integer.valueOf(split[1]);
            }
            Integer value = (Integer) entry.getValue();

            //组装成 BlogLike对象
            BlogLike blogLike = new BlogLike(userId, articleId, value);
            list.add(blogLike);

            //存到list后 从Redis中删除
            redisUtils.hmDel(RedisKeyUtils.MAP_KEY_USER_LIKED, key);
        }
        return list;
    }

    @Override
    public List<LikedCountDTO> getLikedCountFromRedis() {
        Cursor<Map.Entry<Object, Object>> cursor = redisTemplate.opsForHash().scan(RedisKeyUtils.MAP_KEY_USER_LIKED_COUNT,ScanOptions.NONE);
        List<LikedCountDTO> list = new ArrayList<>();
        while (cursor.hasNext()) {
            Map.Entry<Object, Object> map = cursor.next();
            String key = (String) map.getKey();
            Integer articleId = 0;
            if (key != null) {
                articleId = Integer.valueOf(key);
            }
            String value = (String) map.getValue();
            Integer likedNum = 0;
            if (value != null) {
                likedNum = Integer.valueOf(value);
            }
            LikedCountDTO dto = new LikedCountDTO(articleId, likedNum);
            list.add(dto);

            redisUtils.hmDel(RedisKeyUtils.MAP_KEY_USER_LIKED_COUNT, key);
        }
        return list;
    }
}
