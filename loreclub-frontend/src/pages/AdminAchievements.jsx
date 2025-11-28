import { useState, useEffect } from 'react';
import { Trash2, Trophy, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGetAchievements, apiCreateAchievement, apiDeleteAchievement } from '../lib/api';
import Button from '../components/Button';
import Input from '../components/Input';

const OBJECTIVE_TYPES = [
  { value: 'complete_quests', label: 'Completar missões' },
  { value: 'complete_hard_quest', label: 'Completar missão difícil' },
  { value: 'complete_epic_quest', label: 'Completar missão épica' },
  { value: 'earn_coins', label: 'Ganhar moedas' },
  { value: 'complete_all_quests_guild', label: 'Completar todas missões de uma guilda' },
  { value: 'reach_level', label: 'Alcançar nível' },
];

//TODO: Futuramente quero acrescentar icones personalizados, por hora uso emojis
const ICON_OPTIONS = [
  '🗡️',
  '🛡️',
  '🐉',
  '⚔️',
  '📜',
  '🪙',
  '💎',
  '✨',
  '🚀',
  '🧙‍♂️',
  '🧝‍♀️',
  '⚡',
];

export default function AdminAchievements() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    flavorText: '',
    icon: '🏆',
    objectiveType: 'complete_quests',
    objectiveValue: 1,
  });

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetAchievements();
      setAchievements(data);
    } catch (err) {
      setError('Erro ao carregar conquistas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Título é obrigatório');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await apiCreateAchievement(formData);
      setFormData({
        title: '',
        flavorText: '',
        icon: '🏆',
        objectiveType: 'complete_quests',
        objectiveValue: 1,
      });
      await loadAchievements();
    } catch (err) {
      setError('Erro ao criar conquista');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir esta conquista?')) return;

    try {
      setError(null);
      await apiDeleteAchievement(id);
      await loadAchievements();
    } catch (err) {
      setError('Erro ao excluir conquista');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-lore-bg-light bg-opacity-80 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center border-b border-lore-border sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/')} 
            variant="secondary" 
            className="!w-auto !py-2 !px-4 !bg-lore-bg-card hover:!bg-lore-bg-light"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="h-8 w-px bg-gray-700 mx-2"></div>
          <Trophy className="text-lore-pink-lg" size={28} />
          <h1 className="font-title text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lore-purple-lg to-lore-pink-lg">
            Gerenciar Conquistas
          </h1>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div className="bg-lore-bg-light bg-opacity-80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-lore-border shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus size={20} className="text-lore-purple-lg" />
              Criar Nova Conquista
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Título"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Primeira Missão"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ícone</label>
                  <div className="flex gap-2 flex-wrap">
                    {ICON_OPTIONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`w-12 h-12 text-2xl rounded-lg border transition-all ${
                          formData.icon === icon
                            ? 'border-lore-purple-lg bg-lore-purple-lg/20 scale-110'
                            : 'border-lore-border bg-lore-bg-card hover:border-lore-purple-md'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>


              <Input
                label="Texto Especial (Flavor)"
                value={formData.flavorText}
                onChange={(e) => setFormData({ ...formData, flavorText: e.target.value })}
                placeholder="Ex: Todo herói começa com um primeiro passo..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tipo de Objetivo
                  </label>
                  <select
                    value={formData.objectiveType}
                    onChange={(e) => setFormData({ ...formData, objectiveType: e.target.value })}
                    className="w-full px-4 py-2 bg-lore-bg-card border border-lore-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lore-purple-lg"
                  >
                    {OBJECTIVE_TYPES.map((type) => (
                      <option key={type.value} value={type.value} className="bg-lore-bg-card">
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Valor do Objetivo
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min={1}
                    step={1}
                    value={formData.objectiveValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      const n = Number(val);
                      setFormData({
                        ...formData,
                        objectiveValue: Number.isFinite(n) && n > 0 ? n : ''
                      });
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full px-4 py-2 bg-lore-bg-card border border-lore-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lore-purple-lg appearance-none"
                    placeholder="Ex: 5"
                  />
                  <style>{`
                    input[type=number]::-webkit-outer-spin-button,
                    input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                    input[type=number] { -moz-appearance: textfield; }
                  `}</style>
                </div>
              </div>

              <Button type="submit" disabled={creating} className="w-full">
                {creating ? 'Criando...' : 'Criar Conquista'}
              </Button>
            </form>
          </div>

          <div className="bg-lore-bg-light bg-opacity-80 backdrop-blur-sm rounded-lg p-6 border border-lore-border shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">Conquistas Cadastradas</h2>

            {loading ? (
              <p className="text-gray-400 text-center py-8">Carregando...</p>
            ) : achievements.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nenhuma conquista cadastrada</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-lore-bg-card border border-lore-border rounded-lg p-4 hover:border-lore-purple-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{achievement.icon || '🏆'}</div>
                      <button
                        onClick={() => handleDelete(achievement.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1">{achievement.title}</h3>

                    {achievement.flavor_text && (
                      <p className="text-lore-pink-lg text-xs italic mb-2">
                        "{achievement.flavor_text}"
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-lore-border">
                      {OBJECTIVE_TYPES.find((t) => t.value === achievement.objective_type)?.label ||
                        achievement.objective_type}
                      : {achievement.objective_value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
