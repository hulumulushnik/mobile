import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Todo } from "@/types";
import { useTheme } from "@/context/ThemeContext";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setEditText(todo.text);
      setIsEditing(false);
      return;
    }
    if (trimmed !== todo.text) {
      try {
        setIsUpdating(true);
        await onEdit(todo.id, trimmed);
      } finally {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <View
      style={[
        styles.item,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        isUpdating && styles.itemUpdating,
      ]}
    >
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onToggle(todo.id, !todo.completed)}
        disabled={isUpdating}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={todo.completed ? "checkmark-circle" : "ellipse-outline"}
          size={26}
          color={todo.completed ? colors.success : colors.textMuted}
        />
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={[
            styles.editInput,
            { borderColor: colors.primary, backgroundColor: colors.surface, color: colors.text },
          ]}
          value={editText}
          onChangeText={setEditText}
          onBlur={handleSave}
          onSubmitEditing={handleSave}
          autoFocus
          maxLength={120}
          returnKeyType="done"
        />
      ) : (
        <TouchableOpacity
          style={styles.textContainer}
          onLongPress={() => setIsEditing(true)}
          disabled={isUpdating}
        >
          <Text
            style={[
              styles.text,
              { color: colors.text },
              todo.completed && [
                styles.textCompleted,
                { color: colors.textMuted },
              ],
            ]}
          >
            {todo.text}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.actions}>
        {!isEditing && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setIsEditing(true)}
            disabled={isUpdating}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="pencil-outline" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDelete(todo.id)}
          disabled={isUpdating}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
    marginBottom: 8,
  },
  itemUpdating: {
    opacity: 0.6,
  },
  checkboxContainer: {
    padding: 2,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  textCompleted: {
    textDecorationLine: "line-through",
  },
  editInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    borderWidth: 1.5,
    borderRadius: 6,
  },
  actions: {
    flexDirection: "row",
    gap: 4,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 6,
  },
});
