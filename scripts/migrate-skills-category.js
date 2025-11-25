/**
 * Migration script to add category field to existing skills
 * Run this once to update all skills that don't have a category
 * 
 * Usage: node scripts/migrate-skills-category.js
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      required: true,
    },
    category: {
      type: String,
      enum: ["frontend", "backend", "jaringan", "database"],
      default: "frontend",
      required: true,
    },
    icon: String,
  },
  { timestamps: true }
);

const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

// Auto-detect category based on skill name
function detectCategory(skillName) {
  const name = skillName.toLowerCase();
  
  // Frontend technologies
  const frontendKeywords = [
    "react", "vue", "angular", "next", "nuxt", "svelte",
    "html", "css", "javascript", "typescript", "jsx", "tsx",
    "tailwind", "bootstrap", "material", "ant design", "chakra",
    "webpack", "vite", "parcel", "gulp", "sass", "less", "stylus"
  ];
  
  // Backend technologies
  const backendKeywords = [
    "node", "express", "nestjs", "fastify", "koa",
    "python", "django", "flask", "fastapi",
    "java", "spring", "spring boot",
    "php", "laravel", "symfony", "codeigniter",
    "go", "golang", "rust", "c#", ".net", "asp.net",
    "ruby", "rails", "sinatra"
  ];
  
  // Database technologies
  const databaseKeywords = [
    "mongodb", "mysql", "postgresql", "postgres", "sqlite",
    "redis", "elasticsearch", "cassandra", "dynamodb",
    "oracle", "sql server", "mariadb", "firebase", "firestore"
  ];
  
  // Network/Infrastructure
  const networkKeywords = [
    "docker", "kubernetes", "k8s", "aws", "azure", "gcp",
    "nginx", "apache", "linux", "ubuntu", "debian",
    "ci/cd", "jenkins", "gitlab", "github actions",
    "terraform", "ansible", "puppet", "chef"
  ];
  
  // Check categories in order
  if (frontendKeywords.some(keyword => name.includes(keyword))) {
    return "frontend";
  }
  if (backendKeywords.some(keyword => name.includes(keyword))) {
    return "backend";
  }
  if (databaseKeywords.some(keyword => name.includes(keyword))) {
    return "database";
  }
  if (networkKeywords.some(keyword => name.includes(keyword))) {
    return "jaringan";
  }
  
  // Default to frontend if can't detect
  return "frontend";
}

async function migrate() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error("❌ Missing MONGODB_URI in .env.local");
    process.exit(1);
  }

  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log("✅ Connected to MongoDB");

    // Find all skills without category or with undefined category
    const skills = await Skill.find({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: undefined }
      ]
    });

    console.log(`\n📋 Found ${skills.length} skill(s) without category`);

    if (skills.length === 0) {
      console.log("✅ All skills already have categories. No migration needed.");
      await mongoose.disconnect();
      return;
    }

    console.log("\n🔍 Detecting categories for skills:");
    let updated = 0;
    let frontend = 0;
    let backend = 0;
    let database = 0;
    let jaringan = 0;

    for (const skill of skills) {
      const detectedCategory = detectCategory(skill.name);
      skill.category = detectedCategory;
      await skill.save();
      
      console.log(`  ✓ ${skill.name} → ${detectedCategory}`);
      updated++;
      
      if (detectedCategory === "frontend") frontend++;
      else if (detectedCategory === "backend") backend++;
      else if (detectedCategory === "database") database++;
      else if (detectedCategory === "jaringan") jaringan++;
    }

    console.log(`\n✅ Migration completed!`);
    console.log(`   Updated: ${updated} skill(s)`);
    console.log(`   Frontend: ${frontend}`);
    console.log(`   Backend: ${backend}`);
    console.log(`   Database: ${database}`);
    console.log(`   Jaringan: ${jaringan}`);
    console.log(`\n💡 You can edit categories manually in /admin/skills if needed.`);

    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();

