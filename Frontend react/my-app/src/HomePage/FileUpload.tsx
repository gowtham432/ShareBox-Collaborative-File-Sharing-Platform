import { ChangeEvent, useEffect, useState } from "react";
import './fileupload.css'
import axios from "axios";
import FileAccess from "./FileAccess";

interface FileData {
    file: File;
    admin: string
}

function FileUpload() {
    const [selectedFilesAsAdmin, setSelectedFilesAsAdmin] = useState<FileData[]>([]);
    const [selectedFilesNotAsAdmin, setSelectedFilesNotAsAdmin] = useState<FileData[]>([])
    const [selectedFile, setSelectedFile] = useState<File | null>();
    const [selectedFileName, setSelectedFileName] = useState('')
    const url = "http://localhost:4000"

    useEffect(() => {
        let username: string | null = sessionStorage.getItem("username")
        if (username !== null) {
            username = username.substring(1, username.length - 1);
        }
        const filesAsAdmin: FileData[] = []
        const filesNotAsAdmin: FileData[] = []
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
                    } else {
                        filesNotAsAdmin.push({
                            file,
                            admin: res.data[i].admin
                        })
                    }

                }
                setSelectedFilesAsAdmin(filesAsAdmin)
                setSelectedFilesNotAsAdmin(filesNotAsAdmin)
            }
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0])
            setSelectedFileName(event.target.files[0].name)
        }
    };


    const handleUpload = () => {

        if (!selectedFile) {
            alert("Please select a file.");
            return;
        }
        let username: string | null = sessionStorage.getItem("username")
        if (username !== null) {
            username = username.substring(1, username.length - 1);
        }
        const formData: any = new FormData()
        formData.append("username", username)
        formData.append("admin", 1)
        formData.append("file", selectedFile)

        for (let i = 0; i < selectedFilesAsAdmin.length; i++) {
            if (selectedFilesAsAdmin[i].file.name === selectedFile.name) {
                setSelectedFileName('')
                alert("File already exsist")
                return
            }
        }

        for (let i = 0; i < selectedFilesNotAsAdmin.length; i++) {
            if (selectedFilesNotAsAdmin[i].file.name === selectedFile.name) {
                setSelectedFileName('')
                alert("File already exsist")
                return
            }
        }

        axios.post(url + "/uploadFile", formData).then((res) => {
            setSelectedFileName('')
            alert("File uploaded successfully. Please refresh the page")
        }).catch((error) => {
            console.log(error)
        })

    };

    const handleDownload = (file: FileData) => {
        const url = URL.createObjectURL(file.file);
        const link: any = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.file.name);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }

    const handleRemove = (file: FileData) => {
        let username: string | null = sessionStorage.getItem("username")
        const formData = new FormData()
        formData.append("file", file.file)
        if (username !== null) {
            username = username.substring(1, username.length - 1);
        }
        axios.delete(url + "/deleteFileForId/" + username + "/" + file.file.name + "/" + file.admin)
            .then(() => {
                alert("File deleted successfully. Please refresh the page")
            }).catch((error) => {
                console.log(error)
            })
    }

    return (
        <div className="file-upload-container">
            <div className="file-input-wrapper">
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.xlsx,image/*"
                    multiple
                    className="file-input"
                />
                {selectedFileName && (<p>{selectedFileName}</p>)}
                <button className="upload-button">Choose File</button>
            </div>

            <button onClick={handleUpload} className="upload-button">Upload</button>
            <div className="file-upload-container">
                <h1>Files with Admin Access</h1>
                <ul className="file-list">
                    {selectedFilesAsAdmin && selectedFilesAsAdmin.map((fileData, index) => (
                        <li key={index} className="file-item">
                            <h3 className="file-heading">
                                <a href="#" style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }} onClick={() => handleDownload(fileData)}>{fileData.file.name}</a>
                                <button className="remove-button" onClick={() => handleRemove(fileData)}>Remove</button>
                            </h3>
                        </li>
                    ))}
                    <FileAccess></FileAccess>
                <h1>Files without Admin Access</h1>
                    {selectedFilesNotAsAdmin && selectedFilesNotAsAdmin.map((fileData, index) => (
                        <li key={index} className="file-item">
                            <h3 className="file-heading">
                                <a href="#" style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }} onClick={() => handleDownload(fileData)}>{fileData.file.name}</a>
                                <button className="remove-button" onClick={() => handleRemove(fileData)}>Remove</button>
                            </h3>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FileUpload;