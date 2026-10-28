package com.contentflow.config;

import com.contentflow.model.Content;
import com.contentflow.model.ContentStatus;
import com.contentflow.model.ContentType;
import com.contentflow.model.Platform;
import com.contentflow.repository.ContentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final ContentRepository contentRepository;

    public DataInitializer(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @Override
    public void run(String... args) {
        if (contentRepository.count() > 0) {
            log.info("Database already contains {} content items. Skipping demo seed.", contentRepository.count());
            return;
        }

        log.info("Seeding realistic sample content records into ContentFlow database...");

        LocalDateTime now = LocalDateTime.now();

        List<Content> demoContents = List.of(
                new Content(
                        "Announcing ContentFlow 2.0: The Unified Content Scheduler",
                        "Excited to reveal ContentFlow 2.0! Built from the ground up for modern marketing teams, solopreneurs, and agencies. Schedule across all platforms with a crystal-clear calendar and real-time analytics. #buildinpublic #saas #productivity",
                        ContentType.SOCIAL_POST,
                        Platform.TWITTER_X,
                        ContentStatus.SCHEDULED,
                        now.plusDays(2).withHour(15).withMinute(0).withSecond(0),
                        "launch,saas,productivity",
                        "Divyanshu"
                ),
                new Content(
                        "Why We Architected Our Content Engine on Java 21 & Spring Boot",
                        "In this technical deep dive, we explore why high-throughput scheduling, predictable memory efficiency, and rock-solid relational persistence make Java 21 and Spring Boot the unbeatable backbone for enterprise SaaS applications in 2026.",
                        ContentType.BLOG_DRAFT,
                        Platform.BLOG,
                        ContentStatus.PUBLISHED,
                        now.minusDays(3).withHour(11).withMinute(30).withSecond(0),
                        "engineering,java,architecture",
                        "Marcus Chen"
                ),
                new Content(
                        "5 Content Strategy Mistakes Every B2B Founder Makes",
                        "Most founders treat LinkedIn as an afterthought. Here are the 5 high-impact mistakes to avoid: \n1. Talking features instead of problems\n2. Inconsistent posting cadence\n3. Zero hook in the first 2 lines\n4. Ignoring comments in the first hour\n5. Never repurposing top performers.",
                        ContentType.SOCIAL_POST,
                        Platform.LINKEDIN,
                        ContentStatus.SCHEDULED,
                        now.plusDays(1).withHour(10).withMinute(15).withSecond(0),
                        "growth,b2b,marketing",
                        "Sarah Jenkins"
                ),
                new Content(
                        "Behind the Design: Crafting the ContentFlow Minimalist Interface",
                        "Swipe to see our evolution from wireframes to high-fidelity dark-mode prototypes. We focused on visual hierarchy, muted accents (#E5484D), and micro-interactions that feel snappy. What do you think of the new calendar grid?",
                        ContentType.SOCIAL_POST,
                        Platform.INSTAGRAM,
                        ContentStatus.SCHEDULED,
                        now.plusDays(4).withHour(18).withMinute(45).withSecond(0),
                        "design,uiux,productdesign",
                        "Elena Rostova"
                ),
                new Content(
                        "Draft: Product Hunt Launch Day Playbook & Community Strategy",
                        "Comprehensive checklist for Tuesday launch:\n- Asset preparation (1280x720 video, 5 carousel slides)\n- First comment by maker drafted\n- Outreach to 50 key supporters on Slack and Discord\n- Live Q&A scheduled for 2:00 PM EST.",
                        ContentType.BLOG_DRAFT,
                        Platform.GENERAL,
                        ContentStatus.DRAFT,
                        null,
                        "producthunt,launch,strategy",
                        "Marcus Chen"
                ),
                new Content(
                        "Customer Spotlight: How ScaleUp Media 4x'd Their Publishing Output",
                        "Discover how an 8-person growth agency standardized their weekly editorial review and scheduled over 400 monthly posts without missing a single deadline using ContentFlow's centralized calendar.",
                        ContentType.SOCIAL_POST,
                        Platform.FACEBOOK,
                        ContentStatus.PUBLISHED,
                        now.minusDays(1).withHour(14).withMinute(0).withSecond(0),
                        "casestudy,agency,growth",
                        "Sarah Jenkins"
                ),
                new Content(
                        "Founder Memo: Staying Focused When Everything Feels Urgent",
                        "Internal reflections on prioritizing roadmap bets, managing technical debt, and keeping product development laser-focused on user value rather than shiny distractions.",
                        ContentType.BLOG_DRAFT,
                        Platform.BLOG,
                        ContentStatus.DRAFT,
                        null,
                        "leadership,culture,founders",
                        "Elena Rostova"
                )
        );

        contentRepository.saveAll(demoContents);
        log.info("Successfully seeded {} content records.", demoContents.size());
    }
}
