package com.example.demo.Util;

public class RedisKeyUtils {

    //保存用户点赞数据的key
    public static final String MAP_KEY_USER_LIKED = "MAP_USER_LIKED";

    //保存用户被点赞数量的key
    public static final String MAP_KEY_USER_LIKED_COUNT = "MAP_USER_LIKED_COUNT";


    public static String getLikedKey(String articleId, String userId) {
        StringBuilder builder = new StringBuilder();
        builder.append(articleId);
        builder.append("::");
        builder.append(userId);
        return builder.toString();
    }
}
