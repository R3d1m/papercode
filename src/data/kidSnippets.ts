export interface KidCodePreset {
  id: string;
  title: string;
  emoji: string;
  tag: string;
  color: string;
  storyDescription: string;
  handwrittenAuthor: string;
  school: string;
  code: string;
  outputPreview: string;
}

export const KID_PRESETS: KidCodePreset[] = [
  {
    id: 'rocket-game',
    title: 'Space Rocket Countdown',
    emoji: '🚀',
    tag: 'Python Loop Magic',
    color: '#E6F94E',
    storyDescription: 'Tanvir wrote this on his ICT exam khata during a power outage to launch a rocket to Mars!',
    handwrittenAuthor: 'Tanvir (Age 13)',
    school: 'Chittagong Collegiate',
    code: `# 🚀 Space Rocket Launch - by Tanvir
import time

print("🌟 3... 2... 1... IGNITION!")
for seconds in [3, 2, 1]:
    print(f"⏰ T-minus {seconds} seconds...")

print("🔥 ROCKET BLASTOFF!")
print("        /\\")
print("       /  \\")
print("      | PC |")
print("     /|____|\\")
print("    /_|____|_\\")
print("      / || \\")
print("     *  **  *")
print("✨ Reached Earth Orbit! PaperCode is in space!")`,
    outputPreview: `🌟 3... 2... 1... IGNITION!
⏰ T-minus 3 seconds...
⏰ T-minus 2 seconds...
⏰ T-minus 1 seconds...
🔥 ROCKET BLASTOFF!
        /\
       /  \
      | PC |
     /|____|\
    /_|____|_\
      / || \
     *  **  *
✨ Reached Earth Orbit! PaperCode is in space!`
  },
  {
    id: 'cat-pet',
    title: 'Virtual Pet Cat: "Biral"',
    emoji: '🐱',
    tag: 'If-Else Superpowers',
    color: '#FF5722',
    storyDescription: 'Sumaiya handwrote this code to feed her digital cat with fish and milk!',
    handwrittenAuthor: 'Sumaiya (Age 12)',
    school: 'Sunamganj Haor School',
    code: `# 🐱 Virtual Cat Pet Simulator
def feed_cat(food):
    print(f"🍽️ Giving {food} to Biral the Cat...")
    if food == "fish" or food == "ilish":
        return "😺 MEOW! Purr purr... I love Bangladeshi Ilish fish!"
    elif food == "milk":
        return "🥛 Slurp slurp! Delicious warm milk!"
    else:
        return "😿 Meow? I only eat fish or milk!"

print("=== Biral Cat Pet Simulator ===")
print(feed_cat("ilish"))
print(feed_cat("milk"))
print(feed_cat("broccoli"))`,
    outputPreview: `=== Biral Cat Pet Simulator ===
🍽️ Giving ilish to Biral the Cat...
😺 MEOW! Purr purr... I love Bangladeshi Ilish fish!
🍽️ Giving milk to Biral the Cat...
🥛 Slurp slurp! Delicious warm milk!
🍽️ Giving broccoli to Biral the Cat...
😿 Meow? I only eat fish or milk!`
  },
  {
    id: 'bangla-greeting',
    title: 'Shonar Bangla Greeting Machine',
    emoji: '🇧🇩',
    tag: 'String Fun',
    color: '#10B981',
    storyDescription: 'Rakibul made a generator that greets students across all 64 districts in Bangladesh.',
    handwrittenAuthor: 'Rakibul (Age 14)',
    school: 'Kushtia Zilla School',
    code: `# 🇧🇩 64 Districts Greeting Machine
districts = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"]

print("🎉 Welcome to PaperCode Bangladesh!")
for d in districts:
    print(f"✨ Shuvo Shokal to all young coders in {d}!")

print("🇧🇩 Together we are building Smart Bangladesh!")`,
    outputPreview: `🎉 Welcome to PaperCode Bangladesh!
✨ Shuvo Shokal to all young coders in Dhaka!
✨ Shuvo Shokal to all young coders in Chittagong!
✨ Shuvo Shokal to all young coders in Sylhet!
✨ Shuvo Shokal to all young coders in Rajshahi!
✨ Shuvo Shokal to all young coders in Khulna!
🇧🇩 Together we are building Smart Bangladesh!`
  }
];
