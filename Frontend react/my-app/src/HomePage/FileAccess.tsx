import { useState, useEffect, useRef } from 'react';
import './fileaccess.css'
import Select from 'react-select'
import axios from 'axios';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated()

interface Data {
    value: string;
    label: string;
}

interface FileData {
    file: File;
    admin: string;
}


function FileAccess() {

    const url = "http://localhost:4000"
    const [options, setOptions] = useState<Data[]>([])
    const [selectedUsers, setSelectedUsers] = useState<Data[] | null>([])
    const selectRefUsers = useRef<any>(null)
    const selectRefFiles = useRef<any>(null)
    const [files, setFiles] = useState<FileData[]>([])
    const [fileNames, setFileNames] = useState<Data[]>([])
    const [selectedFilesAsAdmin, setSelectedFilesAsAdmin] = useState<FileData[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<Data[] | null>([])


    useEffect(() => {
        let username: string | null = sessionStorage.getItem("username")
        if (username !== null) {
            username = username.substring(1, username.length - 1);
        }
        const filesAsAdmin: FileData[] = []
        const fileNamesFromDB: Data[] = []
        axios.get(url + "/getAllFilesForId/" + username, { responseType: 'json' }).then((res) => {
            console.log(res.data)
            if (res.data != null) {
                for (let i = 0; i < res.data.length; i++) {
                    const content = res.data[i].content
                    const decodeArray = Uint8Array.from(atob(content), c => c.charCodeAt(0))
                    const blob = new Blob([decodeArray], { type: 'application/octet-stream' })
                    const file = new File([blob], res.data[i].name);
                    if (parseInt(res.data[i].admin) === 1) {
                        filesAsAdmin.push({
                            file,
                            admin: res.data[i].admin
                        })
                        fileNamesFromDB.push({
                            "value": file.name,
                            "label": file.name
                        })
                    }
                }
                setSelectedFilesAsAdmin(filesAsAdmin)
                setFileNames(fileNamesFromDB)
            }
        }).catch((error) => {
            console.log(error)
        })
    }, [])


    useEffect(() => {

        axios.get(url + "/getAll")
            .then((res) => {
                let optionsFromDB: Data[] = []
                let username: string | null = sessionStorage.getItem("username")
                if (username !== null) {
                    username = username.substring(1, username.length - 1);
                }
                for (let i = 0; i < res.data.length; i++) {
                    if (username !== res.data[i].username) {
                        optionsFromDB.push({
                            "value": res.data[i].username,
                            "label": res.data[i].username,
                        })
                    }
                }
                setOptions(optionsFromDB)
            }).catch((error) => {
                console.log(error)
            })
    }, []);

    const handleChangeUsers = (event: any) => {
        setSelectedUsers(event)
    };

    const handleChangeFiles = (event: any) => {
        setSelectedFiles(event)
    }
    const giveAccess = () => {
        console.log(selectedUsers)
        console.log(selectedFiles)
        const selectedFilesWithData: FileData[] = []
        if (selectedFiles) {
            for (let i = 0; i < selectedFiles.length; i++) {
                for (let j = 0; j < selectedFilesAsAdmin.length; j++) {
                    if(selectedFiles[i].value === selectedFilesAsAdmin[j].file.name) {
                        selectedFilesWithData.push({
                            "file": selectedFilesAsAdmin[j].file,
                            "admin": "0"
                        })
                    }
                }
            }
        }


        if (selectedUsers && selectedFilesWithData) {
            for (let i = 0; i < selectedUsers.length; i++) {
                for (let j = 0; j < selectedFilesWithData.length; j++) {
                    const formData: any = new FormData()
                    formData.append("username", selectedUsers[i].value)
                    formData.append("admin", 0)
                    formData.append("file", selectedFilesWithData[j].file)
                    axios.post(url + "/uploadFile", formData).then((res) => {
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            }
            alert("Access granted for the selected users...")
        }

        setSelectedFiles([])
        setSelectedFiles([])
        
        // Clear selected values after giving access
        if (selectRefFiles.current) {
            selectRefFiles.current.clearValue();
        }
        if (selectRefUsers.current) {
            selectRefUsers.current.clearValue();
        }
    }

    return (
        <div className='file-access-container'>
            <div className='select-container'>
                <Select
                    ref={selectRefUsers}
                    options={options}
                    components={animatedComponents}
                    isMulti
                    placeholder="Select Users..."
                    onChange={handleChangeUsers}
                    className="list"
                />
                <Select
                    ref={selectRefFiles}
                    options={fileNames}
                    components={animatedComponents}
                    isMulti
                    placeholder="Select Files..."
                    onChange={handleChangeFiles}
                    className="list"
                />
            </div>
            <br></br>
            <button className='giveaccess-button' onClick={giveAccess}>Give Access</button>
        </div>
    )
}

export default FileAccess;
