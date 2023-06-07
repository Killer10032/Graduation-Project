package com.yjq.programmer.controller.admin;

import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.dto.TagDTO;
import com.yjq.programmer.service.ITagService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-16 14:29
 */
@RestController("AdminTagController")
@RequestMapping("/admin/tag")
public class TagController {

    @Resource
    private ITagService tagService;

    /**
     * 分页获取文章标签数据
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<TagDTO>> getTagList(@RequestBody PageDTO<TagDTO> pageDTO){
        return tagService.getTagList(pageDTO);
    }

    /**
     * 删除文章标签信息
     * @param tagDTO
     * @return
     */
    @PostMapping("/delete")
    public ResponseDTO<Boolean> deleteTag(@RequestBody TagDTO tagDTO){
        return tagService.deleteTag(tagDTO);
    }

    /**
     * 保存文章标签信息
     * @param tagDTO
     * @return
     */
    @PostMapping("/save")
    public ResponseDTO<Boolean> saveTag(@RequestBody TagDTO tagDTO){
        return tagService.saveTag(tagDTO);
    }
}
