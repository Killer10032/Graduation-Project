package com.tell.service;

import com.tell.model.Theme;

import java.util.List;


public interface ThemeService {

    /**
     * 查询所有主题
     * @param pageNo
     * @param pageSize
     * @return
     */
    List<Theme> findThemeAll(Integer pageNo, Integer pageSize);

}
