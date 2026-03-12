package edu.cuit.yingpingsxitong.Config;

import edu.cuit.yingpingsxitong.Entity.Movie;
import edu.cuit.yingpingsxitong.Entity.Review;
import edu.cuit.yingpingsxitong.Entity.User;
import edu.cuit.yingpingsxitong.Repository.MovieRepository;
import edu.cuit.yingpingsxitong.Repository.ReviewRepository;
import edu.cuit.yingpingsxitong.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class DataInitializer implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final SequenceGeneratorService sequenceGenerator;

    @Autowired
    public DataInitializer(MovieRepository movieRepository,
                          UserRepository userRepository,
                          ReviewRepository reviewRepository,
                          SequenceGeneratorService sequenceGenerator) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.sequenceGenerator = sequenceGenerator;
    }

    @Override
    public void run(String... args) throws Exception {
        // 检查数据库是否为空
        if (movieRepository.count() == 0) {
            System.out.println("数据库为空，开始初始化默认数据...");
            initializeMovies();
        }

        if (userRepository.count() == 0) {
            initializeUsers();
        }

        if (reviewRepository.count() == 0) {
            initializeReviews();
        }

        System.out.println("数据初始化完成！");
    }

    private void initializeMovies() throws Exception {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        // 1. 肖申克的救赎
        Movie movie1 = new Movie();
        movie1.setMovieId(sequenceGenerator.getNextSequence("movie_sequence"));
        movie1.setTitle("肖申克的救赎");
        movie1.setDescription("一场谋杀案使银行家安迪蒙冤入狱，谋杀妻子及其情人的罪名将他送进了肖申克监狱。在漫长的十九年牢狱生涯中，他用智慧和希望完成了自我救赎，也给了狱友瑞德重生的希望。");
        movie1.setReleaseDate(sdf.parse("1994-09-10"));
        movie1.setRuntime(142);
        movie1.setPosterImage("https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500");
        movie1.setAverageScore(9.7);
        movieRepository.save(movie1);

        // 2. 霸王别姬
        Movie movie2 = new Movie();
        movie2.setMovieId(sequenceGenerator.getNextSequence("movie_sequence"));
        movie2.setTitle("霸王别姬");
        movie2.setDescription("段小楼与程蝶衣是一对打小一起长大的师兄弟，两人一个演生，一个演旦，一向配合天衣无缝。尤其是《霸王别姬》更是名动京城。在动荡的时代背景下，两人的命运跌宕起伏，最终走向了悲剧的终点。");
        movie2.setReleaseDate(sdf.parse("1993-01-01"));
        movie2.setRuntime(171);
        movie2.setPosterImage("https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=500");
        movie2.setAverageScore(9.6);
        movieRepository.save(movie2);

        // 3. 阿甘正传
        Movie movie3 = new Movie();
        movie3.setMovieId(sequenceGenerator.getNextSequence("movie_sequence"));
        movie3.setTitle("阿甘正传");
        movie3.setDescription("阿甘是个智商只有75的低能儿，但他的人生却充满了传奇色彩。他成为橄榄球明星、越战英雄、乒乓球外交使者、亿万富翁，他始终保持着纯真善良的本性，也见证了美国历史上的重要时刻。");
        movie3.setReleaseDate(sdf.parse("1994-07-06"));
        movie3.setRuntime(142);
        movie3.setPosterImage("https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500");
        movie3.setAverageScore(9.5);
        movieRepository.save(movie3);

        // 4. 泰坦尼克号
        Movie movie4 = new Movie();
        movie4.setMovieId(sequenceGenerator.getNextSequence("movie_sequence"));
        movie4.setTitle("泰坦尼克号");
        movie4.setDescription("1912年4月10日，号称「世界工业史上的奇迹」的豪华客轮泰坦尼克号开始了自己的处女航，从英国的南安普顿出发驶往美国纽约。富家少女罗丝与穷画家杰克在船上相遇并坠入爱河，然而灾难却在这时降临。");
        movie4.setReleaseDate(sdf.parse("1997-12-19"));
        movie4.setRuntime(194);
        movie4.setPosterImage("https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500");
        movie4.setAverageScore(9.5);
        movieRepository.save(movie4);

        // 5. 千与千寻
        Movie movie5 = new Movie();
        movie5.setMovieId(sequenceGenerator.getNextSequence("movie_sequence"));
        movie5.setTitle("千与千寻");
        movie5.setDescription("千寻和爸爸妈妈一同驱车前往新家，在郊外的小路上不慎进入了神秘的隧道。他们来到了一个诡异的世界，千寻的爸爸妈妈因贪吃变成了猪，千寻为了拯救父母，在这个神灵世界中经历了一段奇妙的冒险。");
        movie5.setReleaseDate(sdf.parse("2001-07-20"));
        movie5.setRuntime(125);
        movie5.setPosterImage("https://images.unsplash.com/photo-1560167016-022b78a0258e?w=500");
        movie5.setAverageScore(9.4);
        movieRepository.save(movie5);

        // 6. 盗梦空间
        Movie movie6 = new Movie();
        movie6.setMovieId(sequenceGenerator.getNextSequence("movie_sequence"));
        movie6.setTitle("盗梦空间");
        movie6.setDescription("多姆·柯布是一位经验老道的窃贼，他在这一行业中是最顶尖的人才，因为他能够潜入人们精神最为脆弱的梦境中，窃取潜意识中有价值的秘密。这一次，他接受了一项看似不可能的任务：不是窃取想法，而是植入一个想法。");
        movie6.setReleaseDate(sdf.parse("2010-07-16"));
        movie6.setRuntime(148);
        movie6.setPosterImage("https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500");
        movie6.setAverageScore(9.4);
        movieRepository.save(movie6);

        // 7. 星际穿越
        Movie movie7 = new Movie();
        movie7.setMovieId(sequenceGenerator.getNextSequence("movie_sequence"));
        movie7.setTitle("星际穿越");
        movie7.setDescription("近未来的地球黄沙遍野，小麦、秋葵等基础农作物相继因枯萎病灭绝，人类面临灭绝危机。前NASA宇航员库珀临危受命，与布兰德等科学家一起穿越虫洞，去寻找适合人类居住的新星球。");
        movie7.setReleaseDate(sdf.parse("2014-11-07"));
        movie7.setRuntime(169);
        movie7.setPosterImage("https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500");
        movie7.setAverageScore(9.4);
        movieRepository.save(movie7);

        // 8. 楚门的世界
        Movie movie8 = new Movie();
        movie8.setMovieId(sequenceGenerator.getNextSequence("movie_sequence"));
        movie8.setTitle("楚门的世界");
        movie8.setDescription("楚门是一个标准的中产阶级，生活在一个美丽的小岛上，拥有一份稳定的工作和一个贤惠的妻子。然而，他不知道自己其实生活在一个巨大的摄影棚中，他的人生24小时被全球直播，周围的人都是演员，只有他自己被蒙在鼓里。");
        movie8.setReleaseDate(sdf.parse("1998-06-05"));
        movie8.setRuntime(103);
        movie8.setPosterImage("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500");
        movie8.setAverageScore(9.3);
        movieRepository.save(movie8);

        // 9. 疯狂动物城
        Movie movie9 = new Movie();
        movie9.setMovieId(sequenceGenerator.getNextSequence("movie_sequence"));
        movie9.setTitle("疯狂动物城");
        movie9.setDescription("在一个所有动物和平共处的城市，兔子朱迪从小就梦想能成为动物城市的警察，尽管所有人都认为这是不可能的任务。通过自己的努力，她成为了第一个兔子警官，并与狐狸尼克联手侦破了一桩神秘案件。");
        movie9.setReleaseDate(sdf.parse("2016-03-04"));
        movie9.setRuntime(108);
        movie9.setPosterImage("https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=500");
        movie9.setAverageScore(9.2);
        movieRepository.save(movie9);

        // 10. 大话西游之大圣娶亲
        Movie movie10 = new Movie();
        movie10.setMovieId(sequenceGenerator.getNextSequence("movie_sequence"));
        movie10.setTitle("大话西游之大圣娶亲");
        movie10.setDescription("至尊宝被月光宝盒带回到五百年前，遇见紫霞仙子，被对方打上烙印成为对方的人，并发觉自己已变成孙悟空。紫霞与青霞本是如来佛祖座前日月神灯的灯芯，两人一正一邪，紫霞爱着至尊宝，而他却一心想要拿回月光宝盒回到现代。");
        movie10.setReleaseDate(sdf.parse("1995-02-04"));
        movie10.setRuntime(95);
        movie10.setPosterImage("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500");
        movie10.setAverageScore(9.2);
        movieRepository.save(movie10);

        System.out.println("已初始化 " + movieRepository.count() + " 部电影");
    }

    private void initializeUsers() {
        // 创建一些测试用户
        User user1 = new User();
        user1.setUserId(sequenceGenerator.getNextSequence("user_sequence"));
        user1.setUsername("movie_fan");
        user1.setPassword("password123");
        user1.setEmail("moviefan@example.com");
        user1.setManager(false);
        user1.setPermission(true);
        userRepository.save(user1);

        User user2 = new User();
        user2.setUserId(sequenceGenerator.getNextSequence("user_sequence"));
        user2.setUsername("cinema_lover");
        user2.setPassword("password123");
        user2.setEmail("cinema@example.com");
        user2.setManager(false);
        user2.setPermission(true);
        userRepository.save(user2);

        User user3 = new User();
        user3.setUserId(sequenceGenerator.getNextSequence("user_sequence"));
        user3.setUsername("film_critic");
        user3.setPassword("password123");
        user3.setEmail("critic@example.com");
        user3.setManager(false);
        user3.setPermission(true);
        userRepository.save(user3);

        User user4 = new User();
        user4.setUserId(sequenceGenerator.getNextSequence("user_sequence"));
        user4.setUsername("admin");
        user4.setPassword("admin123");
        user4.setEmail("admin@example.com");
        user4.setManager(true);
        user4.setPermission(true);
        userRepository.save(user4);

        System.out.println("已初始化 " + userRepository.count() + " 个用户");
    }

    private void initializeReviews() {
        // 为电影添加评论
        // 电影1 - 肖申克的救赎的评论
        Review review1 = new Review();
        review1.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review1.setMovieId(1);
        review1.setUserId(1);
        review1.setContent("希望是美好的事物，也许是世间最美好的事物。这部电影让我明白了自由的真正含义，强烈推荐！");
        review1.setScore(10);
        review1.setCreatedAt(new Date());
        reviewRepository.save(review1);

        Review review2 = new Review();
        review2.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review2.setMovieId(1);
        review2.setUserId(2);
        review2.setContent("经典的救赎主题，摩根·弗里曼的旁白太有感染力了。有些鸟儿是关不住的。");
        review2.setScore(10);
        review2.setCreatedAt(new Date());
        reviewRepository.save(review2);

        // 电影2 - 霸王别姬的评论
        Review review3 = new Review();
        review3.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review3.setMovieId(2);
        review3.setUserId(3);
        review3.setContent("张国荣的演技简直神了！不疯魔不成活，这部电影是中国电影的巅峰之作。");
        review3.setScore(10);
        review3.setCreatedAt(new Date());
        reviewRepository.save(review3);

        // 电影3 - 阿甘正传的评论
        Review review4 = new Review();
        review4.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review4.setMovieId(3);
        review4.setUserId(1);
        review4.setContent("生活就像一盒巧克力，你永远不知道下一颗是什么味道。简单却深刻的故事。");
        review4.setScore(9);
        review4.setCreatedAt(new Date());
        reviewRepository.save(review4);

        Review review5 = new Review();
        review5.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review5.setMovieId(3);
        review5.setUserId(2);
        review5.setContent("汤姆·汉克斯的表演太棒了，阿甘的纯真让人感动，这是一部治愈人心的电影。");
        review5.setScore(10);
        review5.setCreatedAt(new Date());
        reviewRepository.save(review5);

        // 电影4 - 泰坦尼克号的评论
        Review review6 = new Review();
        review6.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review6.setMovieId(4);
        review6.setUserId(3);
        review6.setContent("Jack和Rose的爱情故事太感人了，音乐一起就想哭。经典中的经典！");
        review6.setScore(10);
        review6.setCreatedAt(new Date());
        reviewRepository.save(review6);

        Review review7 = new Review();
        review7.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review7.setMovieId(4);
        review7.setUserId(1);
        review7.setContent("视觉效果在当时是顶级的，虽然剧情有点俗套，但情感真挚。");
        review7.setScore(8);
        review7.setCreatedAt(new Date());
        reviewRepository.save(review7);

        // 电影5 - 千与千寻的评论
        Review review8 = new Review();
        review8.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review8.setMovieId(5);
        review8.setUserId(2);
        review8.setContent("宫崎骏的想象力太丰富了！无脸男和千寻的故事每次看都有新感受。");
        review8.setScore(10);
        review8.setCreatedAt(new Date());
        reviewRepository.save(review8);

        // 电影6 - 盗梦空间的评论
        Review review9 = new Review();
        review9.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review9.setMovieId(6);
        review9.setUserId(3);
        review9.setContent("诺兰的脑洞太大了！多层梦境的设计让人叹为观止，结局的陀螺到底停了没有？");
        review9.setScore(10);
        review9.setCreatedAt(new Date());
        reviewRepository.save(review9);

        Review review10 = new Review();
        review10.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review10.setMovieId(6);
        review10.setUserId(1);
        review10.setContent("需要看好几遍才能完全理解的电影，但正是这种烧脑的感觉让人着迷。");
        review10.setScore(9);
        review10.setCreatedAt(new Date());
        reviewRepository.save(review10);

        // 电影7 - 星际穿越的评论
        Review review11 = new Review();
        review11.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review11.setMovieId(7);
        review11.setUserId(2);
        review11.setContent("爱是唯一可以超越时间与空间的事物。汉斯·季默的配乐堪称完美。");
        review11.setScore(10);
        review11.setCreatedAt(new Date());
        reviewRepository.save(review11);

        // 电影8 - 楚门的世界的评论
        Review review12 = new Review();
        review12.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review12.setMovieId(8);
        review12.setUserId(3);
        review12.setContent("如果再也见不到你，祝你早安、午安、晚安。这部电影让人反思什么是真实的生活。");
        review12.setScore(9);
        review12.setCreatedAt(new Date());
        reviewRepository.save(review12);

        // 电影9 - 疯狂动物城的评论
        Review review13 = new Review();
        review13.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review13.setMovieId(9);
        review13.setUserId(1);
        review13.setContent("适合所有年龄段观看！朱迪和尼克的搭档太可爱了，寓意也很深刻。");
        review13.setScore(9);
        review13.setCreatedAt(new Date());
        reviewRepository.save(review13);

        // 电影10 - 大话西游的评论
        Review review14 = new Review();
        review14.setReviewId(sequenceGenerator.getNextSequence("review_sequence"));
        review14.setMovieId(10);
        review14.setUserId(2);
        review14.setContent("曾经有一份真诚的爱情放在我面前... 经典台词太多了，笑中带泪的电影。");
        review14.setScore(10);
        review14.setCreatedAt(new Date());
        reviewRepository.save(review14);

        System.out.println("已初始化 " + reviewRepository.count() + " 条评论");
    }
}
