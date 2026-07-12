import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import UploadFile from './UploadFile'
import FolderUpload from './FolderUpload'

const HomePageTab = () => {
    return (
        <div className='home_page'>
            {/* tabs */}
            <Tabs defaultValue="individual" className="max-w-3xl mt-10 p-5 mx-auto">
                <TabsList>
                    <TabsTrigger value="individual">Individual</TabsTrigger>
                    <TabsTrigger value="folder">Folder</TabsTrigger>
                </TabsList>
                <TabsContent value="individual">
                    <UploadFile />
                </TabsContent>
                <TabsContent value="folder">
                    <FolderUpload />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default HomePageTab