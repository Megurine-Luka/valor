module.exports = app => {
    const router = require('express').Router()
    const mongoose = require('mongoose')
    //引入模型
    const Category = mongoose.model('Category')
    const Article = mongoose.model('Article')
    const Hero = mongoose.model('Hero')
    //接口
    router.get('/news/init', async (req, res) => {
        const parent = await Category.findOne({
            name: '新闻分类'
        })
        //获取分类
        const cats = await Category.find().where({
            parent: parent
        }).lean()
        const newsTitles = ["策划有话说丨新一系野刀即将到来", "三分之地，阵营对决赢手机周边，快来参与！", "曲韵芳华丨经典咏流传 《数字化破局》新文创微纪录片首期全网上线", "王者破浪之战暑期狂欢，专属豪礼送上！", "2020QQ名人赛《王者荣耀》第二期开赛，蓝盈莹、曾可妮携手带来峡谷首秀", "8月11日体验服停机更新公告", "8月11日全服不停机更新公告", "8月6日体验服停机更新公告", "8月6日全服不停机优化公告", "8月6日iOS用户启动游戏异常说明公告", "【看世冠对决 赢豪华大礼】活动公告", "应援世冠得好礼，墨子两款皮肤重塑完成即将登场", "夏日盛典开启，新英雄阿古朵登场！送皮肤、抽内测惊喜好礼享不停", "【三分探险】活动开启公告", "夏日有好礼，峡谷乐不停", "2020年王者荣耀世界冠军杯总决赛门票8月10日正式开售", "8月7日【比赛服】版本更新公告", "7月29日【比赛服】版本更新公告", "7月13日【比赛服】版本更新公告", "2020年王者荣耀世界冠军杯小组赛赛程出炉"]
        const newsList = newsTitles.map(title => {
            const RandomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
            return {
                categories: RandomCats.slice(0, 2),
                title: title
            }
        })
        await Article.deleteMany({})
        await Article.insertMany(newsList)
        res.send(newsList)
    })

    // 新闻列表接口
    router.get('/news/list', async (req, res) => {
        // 获取新闻分类 parent cats
        const parent = await Category.findOne({
            name: '新闻分类'
        })
        // 聚合查询 把文章表加到新闻分类表上
        const cats = await Category.aggregate([
            { $match: { parent: parent._id } },
            {
                $lookup: {
                    from: 'articles',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'newsList'
                }
            },
            // 取5个items
            { $addFields: { newsList: { $slice: ['$newsList', 5] } } }
        ])
        // 添加热门分类
        const subCats = cats.map(v => v._id)
        cats.unshift({
            name: '热门',
            newsList: await Article.find().where({
                categories: { $in: subCats }
            }).populate('categories').limit(5).lean()
        })
        // 统一categoryName
        cats.map(cat => {
            cat.newsList.map(news => {
                news.categoryName = (cat.name === '热门')
                    ? news.categories[0].name : cat.name
                return news
            })
            return cat
        })
        res.send(cats)
    })

    //导入英雄的接口
    router.get('/heroes/init', async (req, res) => {
        await Hero.deleteMany({})
        //跳过热门分类
        const rawData = [{ "categoryName": "热门", "heroes": [{ "name": "鲁班七号", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg" }, { "name": "孙悟空", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "后羿", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg" }, { "name": "铠", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "妲己", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg" }, { "name": "韩信", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg" }, { "name": "亚瑟", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "小乔", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/106/106.jpg" }, { "name": "百里守约", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg" }, { "name": "安琪拉", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg" }] }, { "categoryName": "战士", "heroes": [{ "name": "赵云", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg" }, { "name": "墨子", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg" }, { "name": "钟无艳", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg" }, { "name": "吕布", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg" }, { "name": "夏侯惇", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg" }, { "name": "曹操", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/128/128.jpg" }, { "name": "典韦", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/129/129.jpg" }, { "name": "宫本武藏", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/130/130.jpg" }, { "name": "达摩", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg" }, { "name": "老夫子", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/139/139.jpg" }, { "name": "关羽", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/140/140.jpg" }, { "name": "程咬金", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg" }, { "name": "露娜", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg" }, { "name": "花木兰", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg" }, { "name": "橘右京", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg" }, { "name": "亚瑟", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "孙悟空", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "刘备", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/170/170.jpg" }, { "name": "钟馗", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg" }, { "name": "杨戬", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/178/178.jpg" }, { "name": "雅典娜", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/183/183.jpg" }, { "name": "哪吒", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/180/180.jpg" }, { "name": "铠", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "苏烈", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg" }, { "name": "裴擒虎", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg" }, { "name": "狂铁", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/503/503.jpg" }, { "name": "孙策", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg" }, { "name": "李信", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/507/507.jpg" }, { "name": "盘古", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/529/529.jpg" }, { "name": "云中君", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg" }, { "name": "曜", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/522/522.jpg" }, { "name": "马超", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg" }, { "name": "蒙恬", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/527/527.jpg" }] }, { "categoryName": "法师", "heroes": [{ "name": "小乔", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/106/106.jpg" }, { "name": "墨子", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg" }, { "name": "妲己", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg" }, { "name": "嬴政", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/110/110.jpg" }, { "name": "高渐离", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/115/115.jpg" }, { "name": "孙膑", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg" }, { "name": "扁鹊", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/119/119.jpg" }, { "name": "芈月", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg" }, { "name": "周瑜", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/124/124.jpg" }, { "name": "甄姬", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg" }, { "name": "武则天", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg" }, { "name": "貂蝉", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg" }, { "name": "安琪拉", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg" }, { "name": "露娜", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg" }, { "name": "姜子牙", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/148/148.jpg" }, { "name": "王昭君", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/152/152.jpg" }, { "name": "张良", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/156/156.jpg" }, { "name": "不知火舞", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg" }, { "name": "钟馗", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg" }, { "name": "诸葛亮", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg" }, { "name": "干将莫邪", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/182/182.jpg" }, { "name": "女娲", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/179/179.jpg" }, { "name": "杨玉环", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/176/176.jpg" }, { "name": "弈星", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/197/197.jpg" }, { "name": "米莱狄", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/504/504.jpg" }, { "name": "司马懿", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg" }, { "name": "沈梦溪", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/312/312.jpg" }, { "name": "上官婉儿", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg" }, { "name": "嫦娥", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg" }, { "name": "西施", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/523/523.jpg" }] }, { "categoryName": "坦克", "heroes": [{ "name": "廉颇", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/105/105.jpg" }, { "name": "庄周", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg" }, { "name": "刘禅", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg" }, { "name": "钟无艳", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg" }, { "name": "白起", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/120/120.jpg" }, { "name": "芈月", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg" }, { "name": "吕布", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg" }, { "name": "夏侯惇", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg" }, { "name": "达摩", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg" }, { "name": "项羽", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135.jpg" }, { "name": "程咬金", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg" }, { "name": "刘邦", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/149/149.jpg" }, { "name": "亚瑟", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "牛魔", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg" }, { "name": "张飞", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg" }, { "name": "太乙真人", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg" }, { "name": "东皇太一", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg" }, { "name": "铠", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "苏烈", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg" }, { "name": "梦奇", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg" }, { "name": "孙策", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg" }, { "name": "嫦娥", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg" }, { "name": "猪八戒", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/511/511.jpg" }, { "name": "阿古朵", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg" }] }, { "categoryName": "刺客", "heroes": [{ "name": "赵云", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg" }, { "name": "阿轲", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/116/116.jpg" }, { "name": "李白", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131.jpg" }, { "name": "貂蝉", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg" }, { "name": "韩信", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg" }, { "name": "兰陵王", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/153/153.jpg" }, { "name": "花木兰", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg" }, { "name": "不知火舞", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg" }, { "name": "娜可露露", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/162/162.jpg" }, { "name": "橘右京", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg" }, { "name": "孙悟空", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "百里守约", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg" }, { "name": "百里玄策", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/195/195.jpg" }, { "name": "裴擒虎", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg" }, { "name": "元歌", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/125/125.jpg" }, { "name": "司马懿", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg" }, { "name": "上官婉儿", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg" }, { "name": "云中君", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg" }, { "name": "马超", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg" }, { "name": "镜", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/531/531.jpg" }] }, { "categoryName": "射手", "heroes": [{ "name": "孙尚香", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg" }, { "name": "鲁班七号", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg" }, { "name": "马可波罗", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg" }, { "name": "狄仁杰", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/133/133.jpg" }, { "name": "后羿", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg" }, { "name": "李元芳", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/173/173.jpg" }, { "name": "虞姬", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/174/174.jpg" }, { "name": "成吉思汗", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/177/177.jpg" }, { "name": "黄忠", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/192/192.jpg" }, { "name": "百里守约", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg" }, { "name": "公孙离", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/199/199.jpg" }, { "name": "伽罗", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/508/508.jpg" }, { "name": "蒙犽", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/524/524.jpg" }] }, { "categoryName": "辅助", "heroes": [{ "name": "庄周", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg" }, { "name": "刘禅", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg" }, { "name": "孙膑", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg" }, { "name": "姜子牙", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/148/148.jpg" }, { "name": "牛魔", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg" }, { "name": "张飞", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg" }, { "name": "蔡文姬", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184.jpg" }, { "name": "太乙真人", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg" }, { "name": "大乔", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/191/191.jpg" }, { "name": "鬼谷子", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/189/189.jpg" }, { "name": "明世隐", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.jpg" }, { "name": "杨玉环", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/176/176.jpg" }, { "name": "盾山", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg" }, { "name": "瑶", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg" }, { "name": "鲁班大师", "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/525/525.jpg" }] }]
        const rawData1 = rawData.filter(item => item.categoryName !== '热门')
        //for循环 前面要为数组的项则用 of 前面为数组的索引则为 in
        for (let cat of rawData1) {
            //找出当前分类在数据库中对应的数据
            const category = await Category.findOne({
                name: cat.categoryName
            })
            //给各个英雄加category属性
            cat.heroes = cat.heroes.map(hero => {
                hero.categories = [category]
                return hero
            })
            //录入英雄
            await Hero.insertMany(cat.heroes)
        }
        res.send(await Hero.find())
    })

    //显示英雄分类接口
    router.get('/heroes/list', async (req, res) => {
        //查找英雄分类
        const parent = await Category.findOne({
            name: '英雄分类'
        })
        //聚合查询
        const cats = await Category.aggregate([
            { $match: { parent : parent._id } },
            {
                $lookup: {
                    from: 'heroes',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'heroList'
                }
            }
        ])
        //插入热门栏（取10个）
        const subCats = cats.map(v=>v._id)
        cats.unshift({
            name:'热门',
            heroList:await Hero.find().where({
                categories:{$in:subCats}
            }).limit(10).lean()
        })
        res.send(cats)
    })
    //文章接口
    router.get('/article/:id',async(req,res)=>{
        const data = await Article.findById(req.params.id).lean()
        data.related = await Article.find().where({
            categories:{$in: data.categories}
        }).limit(2)
        res.send(data)
    })
    //英雄详情接口
    router.get('/heroes/:id',async(req,res)=>{
        const data = await Hero
        .findById(req.params.id)
        .populate('categories items1 items2 relationship.hero')
        .lean()
        res.send(data)
    })



    app.use('/web/api', router)
}