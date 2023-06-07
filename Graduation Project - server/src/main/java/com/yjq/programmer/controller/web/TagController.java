package com.yjq.programmer.controller.web;

import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.dto.TagDTO;
import com.yjq.programmer.service.ITagService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-17 8:57
 */
@RestController("WebTagController")
@RequestMapping("/web/tag")
public class TagController {

    @Resource
    private ITagService tagService;

    /**
     * 查询所有文章标签数据
     * @return
     */
    @PostMapping("/all")
    public ResponseDTO<List<TagDTO>> getAllTagList(){
        return tagService.getAllTagList();
    }

}
