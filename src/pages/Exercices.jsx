import { useState } from "react";
import { Search, Play, Clock, Target } from "lucide-react";

export default function Exercices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");

  const exercises = [
    {
      id: "1",
      name: "Rowing machine",
      category: "cardio",
      duration: "15-30 min",
      difficulty: "Intermédiaire",
      tags: ["dos", "cardio", "full-body"],
      videoUrl: "https://www.youtube.com/embed/UCXxvVItLoM", // Exemple
      description:
        "Excellent exercice cardio qui sollicite tout le corps, particulièrement efficace pour le dos.",
      calories: "300-400 cal/30min",
    },
    {
      id: "2",
      name: "Squat au poids du corps",
      category: "renforcement",
      duration: "10-15 min",
      difficulty: "Débutant",
      tags: ["jambes", "renfo", "poids-corps"],
      videoUrl: "https://www.youtube.com/embed/YaXPRqUwItQ",
      description:
        "Mouvement de base pour renforcer les cuisses et les fessiers.",
      calories: "150-200 cal/15min",
    },
    {
      id: "3",
      name: "Étirements lombaires",
      category: "mobilite",
      duration: "5-10 min",
      difficulty: "Débutant",
      tags: ["dos", "mobilité", "récupération"],
      videoUrl: "https://www.youtube.com/embed/4BOTvaRaDjI",
      description:
        "Séquence d'étirements pour soulager les tensions du bas du dos.",
      calories: "50-80 cal/10min",
    },
    {
      id: "4",
      name: "HIIT débutant",
      category: "cardio",
      duration: "20 min",
      difficulty: "Débutant",
      tags: ["cardio", "hiit", "perte-poids"],
      videoUrl: "https://www.youtube.com/embed/ml6cT4AZdqI",
      description:
        "Entraînement fractionné haute intensité adapté aux débutants.",
      calories: "250-350 cal/20min",
    },
  ];

  const categories = [
    { id: "tous", name: "Tous", count: exercises.length },
    {
      id: "cardio",
      name: "Cardio",
      count: exercises.filter((e) => e.category === "cardio").length,
    },
    {
      id: "renforcement",
      name: "Renforcement",
      count: exercises.filter((e) => e.category === "renforcement").length,
    },
    {
      id: "mobilite",
      name: "Mobilité",
      count: exercises.filter((e) => e.category === "mobilite").length,
    },
  ];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "tous" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid gap-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bibliothèque d'exercices
        </h1>
        <p className="text-zinc-400 mt-1">
          Découvre des exercices avec vidéos et conseils
        </p>
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Rechercher un exercice..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 focus:border-zinc-600 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-zinc-700 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Liste des exercices */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12 text-zinc-400">
          Aucun exercice trouvé pour "{searchTerm}"
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ exercise }) {
  const [showVideo, setShowVideo] = useState(false);

  const difficultyColors = {
    Débutant: "bg-green-500/20 text-green-400 border-green-500/30",
    Intermédiaire: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Avancé: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
      {/* Vidéo ou thumbnail */}
      <div
        className="aspect-video bg-zinc-800 relative group cursor-pointer"
        onClick={() => setShowVideo(!showVideo)}
      >
        {showVideo ? (
          <iframe
            src={exercise.videoUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="bg-zinc-700 group-hover:bg-zinc-600 rounded-full p-4 transition-colors">
              <Play className="text-white" size={24} />
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg">{exercise.name}</h3>
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium border ${
              difficultyColors[exercise.difficulty]
            }`}
          >
            {exercise.difficulty}
          </span>
        </div>

        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
          {exercise.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{exercise.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target size={14} />
            <span>{exercise.calories}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {exercise.tags.map((tag) => (
            <span
              key={tag}
              className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
