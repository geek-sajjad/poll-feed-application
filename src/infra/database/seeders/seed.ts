#!/usr/bin/env ts-node

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { PollEntity } from '@/infra/database/models/poll.entity';
import { VoteEntity } from '../models/vote.entity';
import { UserEntity } from '../models/user.entity';

class SimplePollSeeder {
  constructor(private dataSource: DataSource) {}

  async seed(count: number = 10000): Promise<void> {
    console.log(`🌱 Generating ${count} random polls...`);

    const repository = this.dataSource.getRepository(PollEntity);
    const batchSize = 1000;
    let totalCreated = 0;

    for (let batch = 0; batch < Math.ceil(count / batchSize); batch++) {
      const polls: PollEntity[] = [];
      const remainingCount = Math.min(batchSize, count - totalCreated);

      for (let i = 0; i < remainingCount; i++) {
        const poll = new PollEntity();
        poll.title = this.generateRandomTitle();
        poll.options = this.generateRandomOptions();
        poll.tags = this.generateRandomTags();

        polls.push(poll);
      }

      await repository.save(polls);
      totalCreated += polls.length;
      console.log(
        `📦 Saved batch ${batch + 1}: ${totalCreated}/${count} polls`
      );
    }

    console.log(`✅ Successfully seeded ${totalCreated} polls`);
  }

  async clear(): Promise<void> {
    const repository = this.dataSource.getRepository(PollEntity);
    await repository.clear();
    console.log('✅ Successfully cleared all polls');
  }

  private generateRandomTitle(): string {
    const titlePrefixes = [
      'What is your favorite',
      'Which do you prefer',
      "What's the best",
      'How do you feel about',
      "What's your opinion on",
      'Which one would you choose',
      'What do you think about',
      'Which is better',
      "What's your preference for",
      'How would you rate',
      "What's your take on",
      'Which option appeals to you',
      "What's your stance on",
      'How do you view',
      "What's your choice for",
    ];

    const subjects = [
      'artificial intelligence',
      'machine learning',
      'blockchain technology',
      'cloud computing',
      'mobile apps',
      'web development',
      'data science',
      'cybersecurity',
      'DevOps practices',
      'remote work',
      'startup culture',
      'social media',
      'e-commerce platforms',
      'gaming',
      'streaming services',
      'electric vehicles',
      'renewable energy',
      'space exploration',
      'virtual reality',
      'augmented reality',
      'cryptocurrency',
      'digital marketing',
      'online education',
      'health tech',
      'fintech solutions',
      'smart homes',
      'IoT devices',
      'quantum computing',
      '5G technology',
      'autonomous vehicles',
      'sustainable living',
      'digital privacy',
      'open source software',
      'microservices',
      'container technology',
      'serverless computing',
      'edge computing',
      'API design',
      'database optimization',
      'code quality',
      'testing strategies',
      'agile methodologies',
      'project management',
      'team collaboration',
      'productivity tools',
      'work-life balance',
      'career development',
      'skill building',
      'networking',
      'mentorship',
      'leadership styles',
      'innovation',
      'creativity',
      'problem solving',
      'decision making',
      'time management',
    ];

    const prefix =
      titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];

    return `${prefix} ${subject}?`;
  }

  private generateRandomOptions(): string[] {
    const optionPools = [
      ['Excellent', 'Good', 'Average', 'Poor', 'Terrible'],
      ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
      [
        'Very important',
        'Important',
        'Somewhat important',
        'Not important',
        'Irrelevant',
      ],
      ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'],
      ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
      [
        'Premium quality',
        'High quality',
        'Standard quality',
        'Basic quality',
        'Low quality',
      ],
      [
        'Very satisfied',
        'Satisfied',
        'Neutral',
        'Dissatisfied',
        'Very dissatisfied',
      ],
      [
        'Definitely yes',
        'Probably yes',
        'Maybe',
        'Probably no',
        'Definitely no',
      ],
      ['Much better', 'Better', 'Same', 'Worse', 'Much worse'],
      ['React', 'Vue.js', 'Angular', 'Svelte', 'Solid.js', 'Next.js'],
      ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C#', 'PHP'],
      ['AWS', 'Google Cloud', 'Azure', 'DigitalOcean', 'Heroku', 'Vercel'],
      ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'DynamoDB'],
      [
        'Docker',
        'Kubernetes',
        'Jenkins',
        'GitLab CI',
        'GitHub Actions',
        'CircleCI',
      ],
      ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'],
      ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4', 'Choice 5', 'Choice 6'],
      [
        'Alternative Alpha',
        'Alternative Beta',
        'Alternative Gamma',
        'Alternative Delta',
      ],
      [
        'Solution X',
        'Solution Y',
        'Solution Z',
        'Custom solution',
        'No solution needed',
      ],
      ['Morning', 'Afternoon', 'Evening', 'Night', 'Anytime'],
      ['1-2 hours', '3-4 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'],
      [
        'Immediately',
        'Within a week',
        'Within a month',
        'Within 3 months',
        'Eventually',
      ],
      ['Love it', 'Like it', "It's okay", 'Dislike it', 'Hate it'],
      ['Very easy', 'Easy', 'Moderate', 'Difficult', 'Very difficult'],
      ['Very likely', 'Likely', 'Possible', 'Unlikely', 'Very unlikely'],
    ];

    const selectedPool =
      optionPools[Math.floor(Math.random() * optionPools.length)];
    const numOptions = Math.floor(Math.random() * 3) + 3; // 3-5 options

    const shuffled = [...selectedPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(numOptions, selectedPool.length));
  }

  private generateRandomTags(): string[] {
    const availableTags = [
      'technology',
      'programming',
      'web-development',
      'mobile',
      'ai',
      'machine-learning',
      'blockchain',
      'cryptocurrency',
      'cloud',
      'devops',
      'security',
      'database',
      'frontend',
      'backend',
      'fullstack',
      'javascript',
      'typescript',
      'python',
      'java',
      'react',
      'vue',
      'angular',
      'node',
      'api',
      'microservices',
      'startup',
      'business',
      'marketing',
      'sales',
      'productivity',
      'remote-work',
      'collaboration',
      'management',
      'leadership',
      'career',
      'education',
      'learning',
      'innovation',
      'design',
      'ux',
      'ui',
      'gaming',
      'entertainment',
      'streaming',
      'social-media',
      'e-commerce',
      'fintech',
      'healthtech',
      'iot',
      'automotive',
      'energy',
      'sustainability',
      'environment',
      'lifestyle',
      'travel',
      'food',
      'fitness',
      'wellness',
      'music',
      'art',
      'photography',
      'video',
      'content',
      'media',
      'news',
      'politics',
      'science',
      'research',
      'data',
      'analytics',
      'automation',
      'testing',
      'quality',
      'performance',
      'optimization',
      'tools',
      'frameworks',
      'libraries',
      'open-source',
      'community',
      'networking',
      'events',
    ];

    const numTags = Math.floor(Math.random() * 4) + 2; // 2-5 tags
    const shuffled = [...availableTags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const countArg = args[1];

  const count = countArg ? parseInt(countArg, 10) : 10000;

  if (command !== 'help' && (isNaN(count) || count <= 0)) {
    console.error('❌ Invalid count. Please provide a positive number.');
    process.exit(1);
  }

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [PollEntity, VoteEntity, UserEntity],
    synchronize: false,
    logging: false,
  });

  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connected successfully');

    const seeder = new SimplePollSeeder(dataSource);

    switch (command) {
      case 'seed':
        await seeder.seed(count);
        break;

      case 'clear':
        await seeder.clear();
        break;

      case 'refresh':
        await seeder.clear();
        await seeder.seed(count);
        break;

      default:
        console.log(`
Usage: npm run simple-seed [command] [count]

Commands:
  seed [count]     - Run seeder with specified count (default: 10000)
  clear            - Clear all seeded data
  refresh [count]  - Clear and re-seed with specified count (default: 10000)

Examples:
  npm run simple-seed seed           # Seed 10,000 polls
  npm run simple-seed seed 50000     # Seed 50,000 polls
  npm run simple-seed seed 1000000   # Seed 1,000,000 polls
  npm run simple-seed clear          # Clear all polls
  npm run simple-seed refresh 25000  # Clear and seed 25,000 polls

Database Configuration:
Make sure to set these environment variables or modify the DataSource config:
  - DB_HOST (default: localhost)
  - DB_PORT (default: 5432)
  - DB_USERNAME
  - DB_PASSWORD
  - DB_DATABASE

Performance Testing Recommendations:
  - Small test: 1,000 - 10,000 polls
  - Medium test: 50,000 - 100,000 polls
  - Large test: 500,000 - 1,000,000 polls
  - Stress test: 5,000,000+ polls

Troubleshooting:
If you get entity metadata errors:
1. Make sure all related entities are imported and added to the entities array
2. Check that your PollEntity has proper decorators for all relationships
3. Ensure 'reflect-metadata' is imported at the top of this file
        `);
        break;
    }

    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Seeder failed:', error);

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    process.exit(1);
  }

  process.exit(0);
}

main();
