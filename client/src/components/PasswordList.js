import React from 'react'
import {omit} from 'lodash'
import './PasswordList.css'

class PasswordList extends React.Component {

    renderTableHeader(tableData) {
        let header = Object.keys(omit(tableData[0], ['id']))
        return header.map((key, index) => {
           return <th key={index}>{key.toUpperCase()}</th>
        })
     }
     
     renderTableData(tableData) {
        if (tableData === null) return ''
        return tableData.map((cell, index) => {
           const { id, name, password } = cell //destructuring
             return (
                <tr key={id}>
                   <td>{name}</td>
                   <td>{password}</td>
                </tr>
             )
         })
     }
    
    render() {
        var tableData = this.props.passwords
        console.log(tableData)
        if (tableData != null) {
            return (
            <div>
                <h1>Pass Vault</h1>
                <table id='passwords'>
                    <tbody>
                        <tr>{this.renderTableHeader(tableData)}</tr>
                        {this.renderTableData(tableData)}
                    </tbody>
                </table>
            </div>
            )
        }
        else {
            return (
                <p> </p>
            )
        }
     }
}

export default PasswordList