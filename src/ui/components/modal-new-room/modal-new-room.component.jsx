import { useState, useEffect } from "react";
import { useApi } from "../../../useApi/useApi";
import "./modal-new-room.component.css";

export function ModalNewRoom({ onCreate, onClose }) {
  const [roomName, setRoomName] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [limitTime, setLimitTime] = useState(5);
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [passwords, setPasswords] = useState([""]);

  const api = useApi();

  useEffect(() => {
    async function setCategoriesAsync() {
      try {
        const e = await api.getAllCategories();
        setCategories(e || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    }

    setCategoriesAsync();
  }, []);

  const handleAddPassword = () => {
    setPasswords([...passwords, ""]);
  };

  const handlePasswordChange = (index, value) => {
    const newPasswords = [...passwords];
    newPasswords[index] = value;
    setPasswords(newPasswords);
  };

  const handleRemovePassword = (index) => {
    const newPasswords = passwords.filter((_, i) => i !== index);
    setPasswords(newPasswords);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Por favor, insira um nome para a categoria");
      return;
    }

    try {
      const newCategory = {
        name: newCategoryName,
        passwords: passwords.filter(p => p.trim() !== "")
      };

      const createdCategory = await api.createCategory(newCategory);
      
      setCategories([...categories, createdCategory]);
      setCategoryName(createdCategory.name);
      setShowNewCategoryForm(false);
      setNewCategoryName("");
      setPasswords([""]);
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Erro ao criar categoria");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRoom = {
      name: roomName,
      categoryName: categoryName,
      limitTime,
      minPlayers,
      maxPlayers,
    };
    onCreate(newRoom);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Criar Nova Sala</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome da Sala:</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoria:</label>
            <div className="category-select-container">
              {categories && categories.length > 0 ? (
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  disabled={showNewCategoryForm}
                >
                  <option value="" disabled>Selecione uma opção</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Nenhuma categoria disponível</p>
              )}
              <button
                type="button"
                onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                className="toggle-category-form"
              >
                {showNewCategoryForm ? "Usar existente" : "Criar nova"}
              </button>
            </div>

            {showNewCategoryForm && (
              <div className="new-category-form">
                <div className="form-group">
                  <label>Nome da Nova Categoria:</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Palavras-chave (senhas):</label>
                  {passwords.map((password, index) => (
                    <div key={index} className="password-input-group">
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => handlePasswordChange(index, e.target.value)}
                        placeholder="Digite uma palavra-chave"
                        required={index === 0}
                      />
                      {passwords.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePassword(index)}
                          className="remove-password"
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddPassword}
                    className="add-password"
                  >
                    Adicionar Palavra-chave
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="create-category-button"
                >
                  Criar Categoria
                </button>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Jogadores Mínimos:</label>
              <input
                type="number"
                min="1"
                value={minPlayers}
                onChange={(e) => setMinPlayers(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label>Jogadores Máximos:</label>
              <input
                type="number"
                min={minPlayers}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button 
              type="submit" 
              className="create-button"
              disabled={showNewCategoryForm}
            >
              Criar Sala
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}