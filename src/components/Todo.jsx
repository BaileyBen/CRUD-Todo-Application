import {React, useEffect, useState, createContext} from 'react'
import {AiOutlinePlus} from 'react-icons/ai'
import TodoList from './TodoList'
import {db} from './Firebase'
import {query, collection, onSnapshot, updateDoc,doc, addDoc, deleteDoc} from 'firebase/firestore'

const style = {
    bg: `h-screen w-screen p-4 bg-black/90`,
    container: `bg-black/30 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4 border border-[#6900ff]/70 mt-10`,
    heading: 'text-3xl font-bold text-center text-gray-300 p-5',
    form: `flex justify-between`,
    input: `border p-2 w-full text-xl font-bold`,
    button: `border p-4 ml-2 bg-[#6900ff]/50 hover:bg-[#6900ff]/20`,
    count: `text-center font-bold text-lg text-white`
}

const Todo = ({todo}) => {
    const [todos, setTodos] = useState([])
    const [input, setInput] = useState('');

    //Create Todo
    const createTodo = async (e) => {
        e.preventDefault(e);
        if (input === '') {
          alert('Please enter a valid todo');
          return;
        }
        await addDoc(collection(db, 'todos'), {
          text: input,
          completed: false,
        });
        setInput('');
      };
    //Read todo from firebase
    useEffect(()=> {
        const q = query(collection(db, 'todos'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let todosArr = []
            querySnapshot.forEach((doc) => {
                todosArr.push({...doc.data(), id: doc.id})
            });
            setTodos(todosArr)
        })
        return () => unsubscribe()
    }, [])
    //Update todo in firebase
    const toggleComplete = async (todo) => {
        await updateDoc(doc(db, 'todos', todo.id), {
          completed: !todo.completed,
        });
      };
    //Delete todo
    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, 'todos', id));
      };
  return (
  
<div className={style.bg}>
    <div className={style.container}>
        <h3 className={style.heading}>Todo List</h3>
           <form onSubmit={createTodo} className={style.form}>
             <input value={input} onChange={(e) => setInput(e.target.value)} className={style.input} type="text" placeholder="Add Todo"/>
               <button className={style.button}><AiOutlinePlus className='text-white' size={30}/></button>
                </form>
                <ul>
                    {todos.map((todo, index) => (
                <TodoList key={index} todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} />
                   ))}
                </ul>
             
                {todos.length < 1 ? null : <p className={style.count}>You have {todos.length} todos</p>}
             
        </div>
</div>
  )
}

export default Todo