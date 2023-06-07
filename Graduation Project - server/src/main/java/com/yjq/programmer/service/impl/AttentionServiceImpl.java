package com.yjq.programmer.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yjq.programmer.bean.CodeMsg;
import com.yjq.programmer.dao.AttentionMapper;
import com.yjq.programmer.dao.UserMapper;
import com.yjq.programmer.domain.Attention;
import com.yjq.programmer.domain.AttentionExample;
import com.yjq.programmer.domain.User;
import com.yjq.programmer.dto.AttentionDTO;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.dto.UserDTO;
import com.yjq.programmer.service.IAttentionService;
import com.yjq.programmer.utils.CommonUtil;
import com.yjq.programmer.utils.CopyUtil;
import com.yjq.programmer.utils.UuidUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-22 10:45
 */
@Service
@Transactional
public class AttentionServiceImpl implements IAttentionService {

    @Resource
    private AttentionMapper attentionMapper;

    @Resource
    private UserMapper userMapper;

    /**
     * 关注用户操作
     * @param attentionDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> addAttention(AttentionDTO attentionDTO) {
        if(CommonUtil.isEmpty(attentionDTO.getFromId()) || CommonUtil.isEmpty(attentionDTO.getToId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        if(attentionDTO.getFromId().equals(attentionDTO.getToId())) {
            return ResponseDTO.errorByMsg(CodeMsg.ATTENTION_SELF_ERROR);
        }
        AttentionExample attentionExample = new AttentionExample();
        attentionExample.createCriteria().andFromIdEqualTo(attentionDTO.getFromId()).andToIdEqualTo(attentionDTO.getToId());
        List<Attention> attentionList = attentionMapper.selectByExample(attentionExample);
        if(attentionList.size() > 0) {
            return ResponseDTO.errorByMsg(CodeMsg.ATTENTION_AGAIN_ERROR);
        }
        Attention attention = CopyUtil.copy(attentionDTO, Attention.class);
        attention.setId(UuidUtil.getShortUuid());
        attention.setCreateTime(new Date());
        if(attentionMapper.insertSelective(attention) == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.ATTENTION_ADD_ERROR);
        }
        return ResponseDTO.successByMsg(true, "关注用户成功！");
    }

    /**
     * 取消关注用户操作
     * @param attentionDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> removeAttention(AttentionDTO attentionDTO) {
        if(CommonUtil.isEmpty(attentionDTO.getFromId()) || CommonUtil.isEmpty(attentionDTO.getToId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        AttentionExample attentionExample = new AttentionExample();
        attentionExample.createCriteria().andFromIdEqualTo(attentionDTO.getFromId()).andToIdEqualTo(attentionDTO.getToId());
        if(attentionMapper.deleteByExample(attentionExample) == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.ATTENTION_REMOVE_ERROR);
        }
        return ResponseDTO.successByMsg(true, "取消关注用户成功！");
    }

    /**
     * 判断是否关注
     * @param attentionDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> judgeAttention(AttentionDTO attentionDTO) {
        if(CommonUtil.isEmpty(attentionDTO.getFromId()) || CommonUtil.isEmpty(attentionDTO.getToId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        AttentionExample attentionExample = new AttentionExample();
        attentionExample.createCriteria().andFromIdEqualTo(attentionDTO.getFromId()).andToIdEqualTo(attentionDTO.getToId());
        List<Attention> attentionList = attentionMapper.selectByExample(attentionExample);
        if(attentionList.size() > 0) {
            return ResponseDTO.success(true);
        } else {
            return ResponseDTO.success(false);
        }
    }

    /**
     * 分页获取关注和粉丝数据
     * @param pageDTO
     * @return
     */
    @Override
    public ResponseDTO<PageDTO<AttentionDTO>> getAttentionList(PageDTO<AttentionDTO> pageDTO) {
        AttentionExample attentionExample = new AttentionExample();
        // 不知道当前页多少，默认为第一页
        if(pageDTO.getPage() == null){
            pageDTO.setPage(1);
        }
        // 不知道每页多少条记录，默认为每页5条记录
        if(pageDTO.getSize() == null){
            pageDTO.setSize(5);
        }
        AttentionExample.Criteria c1 = attentionExample.createCriteria();
        List<Attention> attentionList = new ArrayList<>();
        if(pageDTO.getParam() != null) {
            AttentionDTO attentionDTO = pageDTO.getParam();
            if(CommonUtil.isEmpty(attentionDTO.getToId()) && CommonUtil.isEmpty(attentionDTO.getFromId())) {
                PageInfo<Attention> pageInfo = new PageInfo<>(attentionList);
                // 获取数据的总数
                pageDTO.setTotal(pageInfo.getTotal());
                pageDTO.setList(CopyUtil.copyList(attentionList, AttentionDTO.class));
                return ResponseDTO.success(pageDTO);
            } else if(!CommonUtil.isEmpty(attentionDTO.getToId())) {
                // 查看粉丝
                c1.andToIdEqualTo(attentionDTO.getToId());
            } else if (!CommonUtil.isEmpty(attentionDTO.getFromId())) {
                // 查看关注
                c1.andFromIdEqualTo(attentionDTO.getFromId());
            }
        }
        PageHelper.startPage(pageDTO.getPage(), pageDTO.getSize());
        // 分页查出关注和粉丝数据
        attentionList = attentionMapper.selectByExample(attentionExample);
        PageInfo<Attention> pageInfo = new PageInfo<>(attentionList);
        pageDTO.setTotal(pageInfo.getTotal());
        // 讲domain类型数据  转成 DTO类型数据
        List<AttentionDTO> attentionDTOList = CopyUtil.copyList(attentionList, AttentionDTO.class);
        for(AttentionDTO attentionDTO : attentionDTOList) {
            User fromUser = userMapper.selectByPrimaryKey(attentionDTO.getFromId());
            attentionDTO.setFromUserDTO(CopyUtil.copy(fromUser, UserDTO.class));
            User toUser = userMapper.selectByPrimaryKey(attentionDTO.getToId());
            attentionDTO.setToUserDTO(CopyUtil.copy(toUser, UserDTO.class));
        }
        pageDTO.setList(attentionDTOList);
        return ResponseDTO.success(pageDTO);
    }

    /**
     * 获取全部关注和粉丝数据
     * @param attentionDTO
     * @return
     */
    @Override
    public ResponseDTO<List<AttentionDTO>> getAllAttentionList(AttentionDTO attentionDTO) {
        List<Attention> attentionList = new ArrayList<>();
        if(CommonUtil.isEmpty(attentionDTO.getFromId()) && CommonUtil.isEmpty(attentionDTO.getToId())) {
            return ResponseDTO.success(CopyUtil.copyList(attentionList, AttentionDTO.class));
        }
        AttentionExample attentionExample = new AttentionExample();
        AttentionExample.Criteria c1 = attentionExample.createCriteria();
        if(!CommonUtil.isEmpty(attentionDTO.getToId())) {
            // 查看粉丝
            c1.andToIdEqualTo(attentionDTO.getToId());
        } else if (!CommonUtil.isEmpty(attentionDTO.getFromId())) {
            // 查看关注
            c1.andFromIdEqualTo(attentionDTO.getFromId());
        }
        attentionList = attentionMapper.selectByExample(attentionExample);
        List<AttentionDTO> attentionDTOList = CopyUtil.copyList(attentionList, AttentionDTO.class);
        for(AttentionDTO data : attentionDTOList) {
            User fromUser = userMapper.selectByPrimaryKey(data.getFromId());
            data.setFromUserDTO(CopyUtil.copy(fromUser, UserDTO.class));
            User toUser = userMapper.selectByPrimaryKey(data.getToId());
            data.setToUserDTO(CopyUtil.copy(toUser, UserDTO.class));
        }
        return ResponseDTO.success(attentionDTOList);
    }
}
