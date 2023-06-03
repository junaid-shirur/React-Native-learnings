import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import Todo from './Todo';

export default function Todos() {
    const [text, setText] = useState("")
    const [todos, setTodos] = useState([])
    const [isEdit, setIsEdit] = useState({ val: "", ind: false })

    const onDelete = (todo) => {
        setTodos(todos.filter(item => item !== todo))
    }

    const onEdit = (todo) => {
        setIsEdit({ val: todo, ind: !isEdit.ind })
        setText(todo)
    }

    const onSubmit = () => {
        if (isEdit.ind) {
            setTodos(todos.map(itm => (itm === isEdit.val ? text : itm)))
            setIsEdit({ val: "", ind: !isEdit.ind })
            setText("")

        } else {
            setTodos(t => ([...t, text]))
            setText("")
        }
    }
    return (
        <SafeAreaView style={styles.conatiner}>
            <Text style={styles.title}>Todo App</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='write a todo'
                    onChangeText={newText => setText(newText)}
                    defaultValue={text}
                />
                <TouchableOpacity style={styles.button} activeOpacity={text.length ? 1 : 0.7} disabled={text.length == 0} onPress={onSubmit}>
                    <Text style={styles.buttonText}>{isEdit.ind ? "Edit" : "Add"}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, width: 'auto', minWidth: 300 }}>
                <FlatList
                    data={todos}
                    renderItem={({ item }) => <Todo label={item} onDeletePress={() => onDelete(item)} onEditPress={() => onEdit(item)} />}
                    contentContainerStyle={{ flexGrow: 1, width: '100%' }}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingVertical: 32,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingHorizontal: 3,
        alignItems: 'center',
        justifyContent:'center'
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        width: 135,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 16,
    },
    button: {
        flex: 1,
        height: "auto",
        maxWidth: 40,
        backgroundColor: '#2196F3',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        marginBottom:18, 
        marginHorizontal: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})