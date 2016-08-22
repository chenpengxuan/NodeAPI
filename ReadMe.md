<i class="icon-file"></i> **直播Admin**[^stackedit]接口交互文档
=======
 <i class="icon-provider-gdrive"></i> Author CPX
> <i class="icon-cog"></i> **注意事项**
>
> - 站点url：productadmin.ymatou.cn
> - 如果接口中没有特别注明，则表示当前接口是需要权限验证的
> - 请关注接口中版本号的变更，所有接口都将进行严格版本控制
> - 为了保证返回信息的规范性，统一返回格式如下：
> ```
> {
  "Time": "", //当前服务器时间 格式为 YYYY-MM-DD HH:mm:ss
  "Success": false,//系统接口调用是否成功
  "BCode": 0,//业务编码
  "Code": 200,//Http状态码
  "Msg": "some messge string",//返回信息，不建议前端直接显示此信息，应该根据BCode对应的业务场景使用各自的话术
   "Data": { //请确保Data是个Object而不是ArrayList，String，int，null等等，请不要把Data写成Result，RetResult
    "Total":2000, //不要使用 TotalCount，TotalPage，如果没有分页可以没有，Total表示符合条件的总数
    "Rows": [
          {"Age": 5,"Name": 'tom'},
          {"Age": 5,"Name": 'tom'}
    ] //如果是表格数据请使用Rows属性名：代替现有的各种Products，OrderList等等，如果list没有数据请返回[],而不是null
   }
}
> ```
> - 所有接口的Response参数描述只是针对统一返回格式中的Data业务数据进行扩展描述
> - 访问限制：内网


-----------------------
接口列表
--------

####<i class="icon-pencil"></i> 获取直播信息列表
: 接口url：/api/LiveAdmin/GetLiveInfoList
: 接口调用方式：GET
: 接口Request信息
		|参数              |类型                    | 是否必填 |字段描述        |默认值         																 |
		|----------------- | ---------------------- | ---------|----------------|------------------------------------------------|
		| BuyerId          | int                    | 否       | 买手id         | 0             																 |
		| CountryId        | int                    | 是       | 国家id         | -1            																 |
		| StartTime        | date                   | 是       | 直播开始日期   | 日期类型最小值																 |
    | EndTime          | date                   | 是       | 直播结束日期   | 日期类型最大值 																 |
    | ActivityState    | int                    | 是       | 直播类型       | -1表示未开始 0表示进行中 1 表示结束 2表示未生效|
    | PageSize         | int                    | 是       | 分页每页条目数 | 25            																 |
    | PageIndex        | int                    | 是       | 当前页         | 1             																 |
:接口Response信息
    |参数               | 类型                |字段描述          |
		|-----------------  | ------------------- | -----------------|
		| Seller					  | string							| 买手Id(用户名)   |
		| ActivityId		    | int									| 直播编号         |
		| Title					    | string							| 直播名称         |
    | StartTime			    | date								| 直播开始时间     |
    | EndTime					  | date								| 直播结束时间     |
    | ActivityState		  | int									| 直播介绍         |
    | ActivityName	    | string						  | 直播地名称       |
    | ActivityInfo	    | string							| 直播地地址       |
    | PageIndex			    | int									| 直播视频         |
    | ActivityStatusText| string							| 直播状态名称     |
    | ActivityStatus		| int									| 直播状态         |
    | VideoUrl					| string							| 直播视频url      |


####<i class="icon-pencil"></i> 获取直播信息列表
: 接口url：/api/LiveAdmin/GetLiveDetailInfo
: 接口调用方式：GET
: 接口Request信息
		|参数              |类型                    | 是否必填 |字段描述        |默认值         																 |
		|----------------- | ---------------------- | ---------|----------------|------------------------------------------------|
		| ActivityId       | int                    | 是       | 活动id         | 0             																 |

:接口Response信息
    |参数               | 类型                |字段描述          															|
		|-----------------  | ------------------- | ----------------------------------------------|
		| Title					    | string							| 直播名称   			 															|
		| VideoCover		    | string							| 视频封面图片     															|
		| VideoUrl				  | string							| 直播视频url      															|
    | BrandList			    | List								| 好货分类     		 															|
    | ActivityId			  | int								  | 直播id		       															|
    | ActivityInfo		  | string							| 扫货地           															|
    | ActivityContent	  | string						  | 冗余字段 扫货地，用在直播详情中 							|
    | Brands 	          | string							| 品牌列表       								  							|
    | CountryId			    | int									| 国家id								          							|
    | OffLineReasons    | string							| 下线原因     																	|
    | ActivityName		  | string							| 扫货地         																|
    | StartTime					| date							  | 直播开始时间     															|
    | EndTime				    | date								| 直播结束时间								    							|
    | SellerId          | int							    | 卖家id      																	|
    | ShopAddress		    | string							| 卖家地址        							  							|
    | AddTime					  | date							  | 创建直播时间      						  							|
    | Seller			      | string						  | 卖家名称								        							|
    | SellerLogo        | string							| 买手头像     									  							|
    | Flag		  				| string							| 买手所在国家国旗图片         									|
    | ActivityPicture		| string							| 直播主图url      															|
    | FollowUserNum		  | int								  | 关注用户数        														|
    | Action					  | int							    | 是否有效 1表示有效 0表示无效    							|
    | ProductPics			  | List							  | 相关商品图片地址（1-4个）											|
    | ProductIds    		| List								| 相关商品id列表    														|
    | ProductList		  	| List								| 直播相关商品信息列表         									|
    | ProductCount		  | int									| 商品数量    																	|
    | CategoryList		  | List								| 品类列表        							  							|
    | ActivityState			| int							  	| 直播状态值      						  								|
    | ActivityStatusText| string							| 直播状态								        							|
    | IsInProgress    	| int									| 直播是否正在进行中 1表示进行中 0表示不在进行中|
    | IsReplay		  		| boolean							| 是否回播        														  |
    | ActivityLiveId		| int									| 直播活动id      														  |
    | ActivityLive			| ActivityLiveInfo		| 直播活动								        						  |
    | Country    				| string							| 国家名称    																  |
    | OriginalActivityId| int									| 回播类型的直播对应的原直播id    						  |
    | DeliverType				| int									| 物流类型      								  						  |
    | VideoAction				| int									| 视频状态 0表示修改视频 1 删除视频							|

# YmtNodeApi
