/*
Navicat MySQL Data Transfer

Source Server         : 主库
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : db_blog_and_bbs

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2023-02-26 11:45:05
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `article`
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` char(8) NOT NULL DEFAULT '' COMMENT '文章id',
  `title` varchar(64) NOT NULL DEFAULT '' COMMENT '文章标题',
  `user_id` char(8) NOT NULL DEFAULT '' COMMENT '文章所属用户id',
  `summary` varchar(128) NOT NULL DEFAULT '' COMMENT '文章摘要',
  `content_html` longtext COMMENT '文章正文内容(html)',
  `content_markdown` longtext COMMENT '文章正文内容(markdown)',
  `create_time` datetime NOT NULL COMMENT '文章创建时间',
  `update_time` datetime NOT NULL COMMENT '文章更新时间',
  `type` int(2) NOT NULL DEFAULT '1' COMMENT '文章类型  1：博客；2：问答',
  `view_num` int(8) NOT NULL DEFAULT '0' COMMENT '文章浏览数',
  `collect_num` int(8) NOT NULL DEFAULT '0' COMMENT '文章收藏数',
  `like_num` int(8) NOT NULL DEFAULT '0' COMMENT '文章点赞数',
  `comment_num` int(8) NOT NULL DEFAULT '0' COMMENT '文章评论数',
  `state` int(2) NOT NULL DEFAULT '6' COMMENT '文章状态：1：待审核；2：未解决；3：已解决；4：审核通过；5：审核不通过；6：草稿',
  `category_id` char(8) NOT NULL DEFAULT '' COMMENT '文章分类id',
  `top` int(2) NOT NULL DEFAULT '1' COMMENT '是否置顶 1：否；2：是',
  `official` int(2) NOT NULL DEFAULT '1' COMMENT '是否官方 1：否；2：是',
  `essence` int(2) NOT NULL DEFAULT '1' COMMENT '是否加精 1：否；2：是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES ('0ckWQw1K', '大家好，我是站长杨杨吖', 'wlBm2kmd', '大家好，杨杨吖博客欢迎您哦！', '<table>\n<thead>\n<tr>\n<th>我</th>\n<th>是</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>啊</td>\n<td>啊</td>\n</tr>\n</tbody></table>\n<p><img src=\"http://127.0.0.1:8081/common/photo/view?filename=20230225/1677330141302.jpg\" alt=\"QQ头像.jpg\"></p>\n<h2 id=\"你好啊\">你好啊</h2>\n', '|我  |  是|\n|--|--|\n| 啊 | 啊 |\n\n![QQ头像.jpg](http://127.0.0.1:8081/common/photo/view?filename=20230225/1677330141302.jpg)\n\n## 你好啊', '2023-02-25 21:03:00', '2023-02-25 21:03:00', '1', '21', '1', '2', '2', '4', 'Orp86B4m', '2', '2', '2');
INSERT INTO `article` VALUES ('1krQmncB', '代码分享，来看看', '7XiHJL18', '小杨杨写的小代码哦！', '<h1 id=\"嗨喽\">嗨喽</h1>\n<h2 id=\"测试代码\">测试代码</h2>\n<pre><code class=\"language-language\"> like.setCreateTime(new Date());\nif(likeMapper.insertSelective(like) == 0 ) {\n    return ResponseDTO.errorByMsg(CodeMsg.LIKE_ERROR);\n}\n        // 更新文章的点赞数\n        article.setLikeNum(article.getLikeNum() + 1);\n        articleMapper.updateByPrimaryKeySelective(article);\n</code></pre>\n', '# 嗨喽\n## 测试代码\n```language\n like.setCreateTime(new Date());\nif(likeMapper.insertSelective(like) == 0 ) {\n    return ResponseDTO.errorByMsg(CodeMsg.LIKE_ERROR);\n}\n        // 更新文章的点赞数\n        article.setLikeNum(article.getLikeNum() + 1);\n        articleMapper.updateByPrimaryKeySelective(article);\n```\n\n\n\n', '2023-02-25 21:15:37', '2023-02-25 21:24:39', '1', '11', '0', '0', '0', '4', 'tm3xVciu', '1', '1', '1');
INSERT INTO `article` VALUES ('61uI2IUA', '这个系统大家觉得咋样呢', 'wlBm2kmd', '大家来评评理啊啊啊啊', '<h1 id=\"啊啊啊啊啊\">啊啊啊啊啊</h1>\n<p><a target=\"_blank\" href=\"https://space.bilibili.com/384182241\" title=\"null\">杨杨网站</a></p>\n<pre><code class=\"language-java\"> <span class=\"hljs-keyword\">public</span> ResponseDTO&lt;PageDTO&lt;ArticleDTO&gt;&gt; <span class=\"hljs-title function_\">getArticleList</span><span class=\"hljs-params\">(<span class=\"hljs-meta\">@RequestBody</span> PageDTO&lt;ArticleDTO&gt; pageDTO)</span>{\n        <span class=\"hljs-keyword\">return</span> articleService.getArticleList(pageDTO);\n    }\n</code></pre>\n', '# 啊啊啊啊啊\n[杨杨网站](https://space.bilibili.com/384182241)\n```java\n public ResponseDTO<PageDTO<ArticleDTO>> getArticleList(@RequestBody PageDTO<ArticleDTO> pageDTO){\n        return articleService.getArticleList(pageDTO);\n    }\n```\n\n', '2023-02-25 22:41:59', '2023-02-25 22:43:50', '2', '14', '0', '0', '0', '3', 'QfHTNH1W', '1', '1', '1');
INSERT INTO `article` VALUES ('IdCyZOze', '啊啊啊啊', 'qG1IXyw5', '啊实打实打算的', '<h1 id=\"啊\">啊</h1>\n<p><img src=\"http://127.0.0.1:8081/common/photo/view?filename=20230226/1677382467987.jpg\" alt=\"QQ头像.jpg\"></p>\n<pre><code class=\"language-css\"><span class=\"hljs-selector-class\">.for</span> {\n<span class=\"hljs-attribute\">color</span>: red\n}\n</code></pre>\n<p><a target=\"_blank\" href=\"http://localhost:3001/#/login\" title=\"null\">后台</a></p>\n<iframe src=\"//player.bilibili.com/player.html?aid=774747592&bvid=BV1a14y1V7Xc&cid=877387145&page=1\" frameborder=\"no\" width=\"100%\" height=\"500px\"> </iframe>\n\n', '# 啊\n\n![QQ头像.jpg](http://127.0.0.1:8081/common/photo/view?filename=20230226/1677382467987.jpg)\n```css\n.for {\ncolor: red\n}\n```\n[后台](http://localhost:3001/#/login)\n<iframe src=\"//player.bilibili.com/player.html?aid=774747592&bvid=BV1a14y1V7Xc&cid=877387145&page=1\" frameborder=\"no\" width=\"100%\" height=\"500px\"> </iframe>\n\n\n', '2023-02-26 11:36:04', '2023-02-26 11:36:19', '1', '1', '0', '0', '1', '4', 'QfHTNH1W', '1', '1', '2');
INSERT INTO `article` VALUES ('QSNMRDqq', '测试测111', '7XiHJL18', '啊啊啊啊啊啊啊啊啊啊啊啊', '<pre><code class=\"language-css\"><span class=\"hljs-selector-class\">.fon</span> {\n<span class=\"hljs-attribute\">color</span>: red\n}\n</code></pre>\n', '```css\n.fon {\ncolor: red\n}\n```\n\n\n', '2023-02-25 21:29:53', '2023-02-25 22:35:03', '1', '9', '0', '0', '0', '4', 'uhvN8A4E', '1', '1', '1');
INSERT INTO `article` VALUES ('SlCuiv89', '问题', '7XiHJL18', '呜呜呜呜呜呜', '<p>问题</p>\n', '问题', '2023-02-25 22:57:28', '2023-02-25 22:57:28', '2', '1', '0', '1', '0', '1', 'FfFbirpg', '1', '1', '1');
INSERT INTO `article` VALUES ('x6c212cn', '555', 'wlBm2kmd', '8', '<p><img src=\"url\" alt=\"alt\"></p>\n', '![alt](url)', '2023-02-25 22:44:12', '2023-02-25 22:44:12', '1', '0', '0', '0', '0', '1', 'QfHTNH1W', '1', '1', '1');
INSERT INTO `article` VALUES ('YmJzJ43B', '啊啊啊啊啊', '7XiHJL18', 'aaa', '<pre><code class=\"language-java\">like.setCreateTime(<span class=\"hljs-keyword\">new</span> <span class=\"hljs-title class_\">Date</span>());\n<span class=\"hljs-keyword\">if</span>(likeMapper.insertSelective(like) == <span class=\"hljs-number\">0</span> ) {\n    <span class=\"hljs-keyword\">return</span> ResponseDTO.errorByMsg(CodeMsg.LIKE_ERROR);\n}\n</code></pre>\n', '```java\nlike.setCreateTime(new Date());\nif(likeMapper.insertSelective(like) == 0 ) {\n    return ResponseDTO.errorByMsg(CodeMsg.LIKE_ERROR);\n}\n```\n\n\n', '2023-02-25 21:30:59', '2023-02-25 22:34:14', '1', '5', '0', '0', '0', '4', 'uhvN8A4E', '1', '1', '1');
INSERT INTO `article` VALUES ('yqjp8NrA', '啊啊啊', 'qG1IXyw5', '啊啊', '<p>啊啊 </p>\n', '啊啊 ', '2023-02-26 11:37:11', '2023-02-26 11:37:11', '2', '1', '0', '0', '1', '3', 'OwhISL8D', '1', '1', '2');

-- ----------------------------
-- Table structure for `attention`
-- ----------------------------
DROP TABLE IF EXISTS `attention`;
CREATE TABLE `attention` (
  `id` char(8) NOT NULL DEFAULT '' COMMENT '关注记录id',
  `from_id` char(8) NOT NULL DEFAULT '' COMMENT '关注发起者id',
  `to_id` char(8) NOT NULL DEFAULT '' COMMENT '受关注者id',
  `create_time` datetime NOT NULL COMMENT '关注时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of attention
-- ----------------------------
INSERT INTO `attention` VALUES ('8Qdtotz6', 'qG1IXyw5', 'wlBm2kmd', '2023-02-26 11:44:33');
INSERT INTO `attention` VALUES ('tFcQV54i', '7XiHJL18', 'wlBm2kmd', '2023-02-25 22:51:58');
INSERT INTO `attention` VALUES ('x2OAyhhf', 'wlBm2kmd', '7XiHJL18', '2023-02-25 22:40:23');

-- ----------------------------
-- Table structure for `category`
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` char(8) NOT NULL DEFAULT '' COMMENT '文章分类id',
  `name` varchar(16) NOT NULL DEFAULT '' COMMENT '文章分类名称',
  `sort` int(8) NOT NULL DEFAULT '0' COMMENT '文章分类排序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('2GBLELNi', 'Java', '0');
INSERT INTO `category` VALUES ('7B49P0PI', '工具', '0');
INSERT INTO `category` VALUES ('bD1EFCNs', '安卓', '0');
INSERT INTO `category` VALUES ('FfFbirpg', '其他', '0');
INSERT INTO `category` VALUES ('Orp86B4m', '公告', '2');
INSERT INTO `category` VALUES ('OwhISL8D', 'C++', '0');
INSERT INTO `category` VALUES ('QfHTNH1W', '活动', '0');
INSERT INTO `category` VALUES ('tm3xVciu', '后端', '0');
INSERT INTO `category` VALUES ('uhvN8A4E', '前端', '1');

-- ----------------------------
-- Table structure for `collect`
-- ----------------------------
DROP TABLE IF EXISTS `collect`;
CREATE TABLE `collect` (
  `id` char(8) NOT NULL DEFAULT '' COMMENT '收藏id',
  `user_id` char(8) NOT NULL DEFAULT '' COMMENT '收藏所属用户id',
  `article_id` char(8) NOT NULL DEFAULT '' COMMENT '收藏所属文章id',
  `create_time` datetime NOT NULL COMMENT '收藏时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of collect
-- ----------------------------
INSERT INTO `collect` VALUES ('NZWDzkFP', 'wlBm2kmd', '0ckWQw1K', '2023-02-25 21:09:55');
INSERT INTO `collect` VALUES ('v2EL837B', 'wlBm2kmd', 'VTZDwTc2', '2023-02-19 09:09:50');

-- ----------------------------
-- Table structure for `comment`
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` char(8) NOT NULL DEFAULT '' COMMENT '评论id',
  `from_id` char(8) NOT NULL DEFAULT '' COMMENT '评论发送者id',
  `to_id` char(8) NOT NULL DEFAULT '' COMMENT '评论被回复者id',
  `parent_id` char(8) NOT NULL DEFAULT '' COMMENT '父级评论id',
  `article_id` char(8) NOT NULL DEFAULT '' COMMENT '评论所属文章id',
  `content` varchar(512) NOT NULL DEFAULT '' COMMENT '评论内容',
  `type` int(2) NOT NULL DEFAULT '1' COMMENT '评论类型：1：发表；2：回复',
  `pick` int(2) NOT NULL DEFAULT '1' COMMENT '是否被采纳：1：否；2：是',
  `create_time` datetime NOT NULL COMMENT '评论时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES ('ihDBvpxx', 'qG1IXyw5', '', '', 'IdCyZOze', '啊啊 ', '1', '1', '2023-02-26 11:37:59');
INSERT INTO `comment` VALUES ('k5VonmhW', 'qG1IXyw5', '', '', 'yqjp8NrA', '啊啊啊啊', '1', '2', '2023-02-26 11:38:10');
INSERT INTO `comment` VALUES ('OLRAfhfE', 'qG1IXyw5', 'qG1IXyw5', 't8HlL6p4', '0ckWQw1K', '啊啊啊啊', '2', '1', '2023-02-26 11:33:20');
INSERT INTO `comment` VALUES ('t8HlL6p4', 'qG1IXyw5', '', '', '0ckWQw1K', '啊啊', '1', '1', '2023-02-26 11:33:13');

-- ----------------------------
-- Table structure for `likes`
-- ----------------------------
DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes` (
  `id` char(8) NOT NULL DEFAULT '' COMMENT '点赞id',
  `user_id` char(8) NOT NULL DEFAULT '' COMMENT '点赞所属用户id',
  `article_id` char(8) NOT NULL DEFAULT '' COMMENT '点赞所属文章id',
  `create_time` datetime NOT NULL COMMENT '点赞时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of likes
-- ----------------------------
INSERT INTO `likes` VALUES ('4fOKHo29', '7XiHJL18', 'SlCuiv89', '2023-02-25 22:57:40');
INSERT INTO `likes` VALUES ('L6RHxDaN', 'qG1IXyw5', '0ckWQw1K', '2023-02-26 11:33:08');
INSERT INTO `likes` VALUES ('mLweqq9c', 'wlBm2kmd', '0ckWQw1K', '2023-02-25 21:09:55');

-- ----------------------------
-- Table structure for `tag`
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` char(8) NOT NULL DEFAULT '' COMMENT '文章标签id',
  `name` varchar(16) NOT NULL DEFAULT '' COMMENT '文章标签名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tag
-- ----------------------------
INSERT INTO `tag` VALUES ('5xD97knu', '公告');
INSERT INTO `tag` VALUES ('AbgtAg6N', '知识分享');
INSERT INTO `tag` VALUES ('CvJ3JsfS', '测试');
INSERT INTO `tag` VALUES ('oE7P5kYe', '运维');
INSERT INTO `tag` VALUES ('UEM4yzl0', 'c++');
INSERT INTO `tag` VALUES ('UHAyQlHv', 'java');

-- ----------------------------
-- Table structure for `tag_item`
-- ----------------------------
DROP TABLE IF EXISTS `tag_item`;
CREATE TABLE `tag_item` (
  `id` char(8) NOT NULL DEFAULT '' COMMENT '标签详情id',
  `tag_id` char(8) NOT NULL DEFAULT '' COMMENT '标签详情所属标签id',
  `article_id` char(8) NOT NULL DEFAULT '' COMMENT '标签详情所属文章id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tag_item
-- ----------------------------
INSERT INTO `tag_item` VALUES ('7np32m93', 'UEM4yzl0', 'x6c212cn');
INSERT INTO `tag_item` VALUES ('7rngUQjQ', 'UHAyQlHv', '1Lrsywek');
INSERT INTO `tag_item` VALUES ('8pTuJkJl', 'UHAyQlHv', 'ay0JubZQ');
INSERT INTO `tag_item` VALUES ('8sWxQlSx', 'CvJ3JsfS', 'YmJzJ43B');
INSERT INTO `tag_item` VALUES ('aQcO7Fld', 'UHAyQlHv', '2F1ld0Wk');
INSERT INTO `tag_item` VALUES ('B5jvU2ey', 'UHAyQlHv', 'Ae4AJLGC');
INSERT INTO `tag_item` VALUES ('cvLiYPvT', 'UHAyQlHv', '1krQmncB');
INSERT INTO `tag_item` VALUES ('EoBL518D', 'UEM4yzl0', '61uI2IUA');
INSERT INTO `tag_item` VALUES ('FdtTjRJI', 'UHAyQlHv', 'VTZDwTc2');
INSERT INTO `tag_item` VALUES ('fP8ZSW9z', 'AbgtAg6N', 'Ae4AJLGC');
INSERT INTO `tag_item` VALUES ('gPpfOWq9', 'UHAyQlHv', '3Xr4wN05');
INSERT INTO `tag_item` VALUES ('IYwPAr1B', 'UHAyQlHv', '0ckWQw1K');
INSERT INTO `tag_item` VALUES ('JjF0r2kb', 'UEM4yzl0', 'QSNMRDqq');
INSERT INTO `tag_item` VALUES ('KILUNUSw', 'oE7P5kYe', 'IdCyZOze');
INSERT INTO `tag_item` VALUES ('l4VP14zm', 'UHAyQlHv', 'dp0iyCxW');
INSERT INTO `tag_item` VALUES ('LFHK2lg0', 'UHAyQlHv', 'Mahlr7mA');
INSERT INTO `tag_item` VALUES ('LtqXB0NC', 'oE7P5kYe', 'yqjp8NrA');
INSERT INTO `tag_item` VALUES ('mzdeLtvl', 'UHAyQlHv', 'IGqlbVj6');
INSERT INTO `tag_item` VALUES ('NnnNlV6o', 'UHAyQlHv', 'AzSwYxwm');
INSERT INTO `tag_item` VALUES ('oj3IUFGT', 'UHAyQlHv', 'MQm3gNeQ');
INSERT INTO `tag_item` VALUES ('Pk3P4xVo', 'oE7P5kYe', 'YmJzJ43B');
INSERT INTO `tag_item` VALUES ('pXQHav3l', 'UHAyQlHv', '7SC1odhb');
INSERT INTO `tag_item` VALUES ('qdJCcJev', 'UHAyQlHv', '61uI2IUA');
INSERT INTO `tag_item` VALUES ('r8TSd4en', 'AbgtAg6N', '1krQmncB');
INSERT INTO `tag_item` VALUES ('rYBY6RC0', 'UHAyQlHv', 'sK65qGTY');
INSERT INTO `tag_item` VALUES ('SgQcR4Z7', 'UHAyQlHv', '3uPg7LXu');
INSERT INTO `tag_item` VALUES ('uGmduXGM', 'UHAyQlHv', 'YWs4ReO1');
INSERT INTO `tag_item` VALUES ('uNP3iMEW', 'CvJ3JsfS', 'IdCyZOze');
INSERT INTO `tag_item` VALUES ('w5KUYz1Y', 'oE7P5kYe', 'QSNMRDqq');
INSERT INTO `tag_item` VALUES ('WKYrXGfJ', 'UHAyQlHv', 'OmiZChD1');
INSERT INTO `tag_item` VALUES ('z9hFg9FP', 'oE7P5kYe', 'SlCuiv89');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` char(8) NOT NULL DEFAULT '' COMMENT '用户id',
  `username` varchar(8) NOT NULL DEFAULT '' COMMENT '用户昵称',
  `password` varchar(16) NOT NULL DEFAULT '' COMMENT '用户密码',
  `role_id` int(1) NOT NULL DEFAULT '1' COMMENT '用户所属角色id 1：普通用户；2：管理员',
  `register_time` datetime NOT NULL COMMENT '注册时间',
  `sex` int(1) NOT NULL DEFAULT '3' COMMENT '用户性别  1：男；2：女；3：未知',
  `head_pic` varchar(256) NOT NULL DEFAULT 'common/no_image.jpg' COMMENT '用户头像',
  `phone` char(11) NOT NULL DEFAULT '' COMMENT '手机号码',
  `info` varchar(64) NOT NULL DEFAULT '' COMMENT '个人简介',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('7XiHJL18', '小杨杨', '123456', '1', '2023-02-25 21:10:20', '1', 'common/no_image.jpg', '13774559485', '小杨杨哦');
INSERT INTO `user` VALUES ('qG1IXyw5', '小李', '123456', '1', '2023-02-26 11:32:58', '3', '20230226/1677382592620.jpg', '13774594853', '12112');
INSERT INTO `user` VALUES ('wlBm2kmd', '杨杨吖', '123456', '2', '2023-02-15 09:26:49', '1', '20230219/1676771478040.jpg', '13774559486', '杨杨吖yyds');
