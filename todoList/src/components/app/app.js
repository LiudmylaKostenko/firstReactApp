import React, {Component} from 'react';
import "../../css/bootstrap.min.css";
import AppHeader from '../app-header';
import TodoList from '../todo-list';
import SearchPanel from '../search-panel';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from "../item-add-form";
import './app.scss';

export default  class App extends  Component {

    maxId = 1;
    state = {
        todoData :[
            this.createToDoItem('Drink Coffee'),
            this.createToDoItem('Make Awesome App'),
            this.createToDoItem('Have a lunch')
        ],
        term:'',
        filter: 'all' //active, all, done
    };

    createToDoItem(label) {
        return {
            label,
            important: false,
            done:false,
            id:this.maxId++
        }
    }

    deleteItem = (id) => {
        this.setState( ({todoData}) => {
            const idx = todoData.findIndex((el) => el.id === id);
            todoData.splice(idx, 1);
            const newArray = [
                ...todoData.slice(0,idx),
                ...todoData.slice(idx + 1)
            ];
            return {
                todoData: newArray
            };
        });
    };

    toggleProperty (arr, id, propName) {
        const idx = arr.findIndex ((el) => el.id === id);
        const oldItem = arr[idx];
        const newItem = {...oldItem,
            [propName]:!oldItem[propName]};

        return[
            ...arr.slice(0,idx),
            newItem,
            ...arr.slice(idx + 1)
        ];
    }

    addItem = (text) => {
        const newItem = this.createToDoItem(text);
        this.setState(({todoData}) => {
        const newArr = [
            ...todoData,
            newItem
        ];
        return {
        todoData: newArr
        };

        });
    };

    onToggleImportant = (id) => {
        this.setState( ({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
            };
        });
    };

    onToggleDone = (id) => {
        this.setState( ({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'done')
            };
        });
    };

    onSearchChange = (term) => {
        this.setState({ term });
    };

    onFilterChange = (filter) => {
        this.setState({ filter });
    };

    search (items, term){
        if (term.length === 0){
            return items;
        }

        return items.filter((item) => {
            return item.label
                .toLowerCase().indexOf(term) > -1;
        });
    }

    filter (items, filter) {
        switch (filter) {
            case 'all':
                return items;
            case 'active':
                return items.filter((item) => !item.done);
            case 'done':
                return items.filter((item) => item.done);
            default:
               return  items;
        }
    }

    render () {

        const { todoData, term, filter } =this.state;
        const visibleItems = this.filter(
                this.search(todoData, term), filter);
        const doneCount = todoData
                         .filter((el) => el.done).length;
        const todoCount = todoData.length - doneCount;

        return (
            <div className = "todo-app">
                <AppHeader toDo = {todoCount} done={doneCount} />
                <div className = "top-panel d-flex">
                    <SearchPanel
                    onSearchChange = {this.onSearchChange}/>
                    <ItemStatusFilter
                        filter = {filter}
                        onFilterChange = {this.onFilterChange} />
                </div>

                <TodoList
                    todos = { visibleItems }
                    onDeleted = {this.deleteItem}
                    onToggleImportant = {this.onToggleImportant}
                    onToggleDone = {this.onToggleDone}
                    />
                <ItemAddForm onItemAdded = {this.addItem}/>
            </div>
        );
    }
};