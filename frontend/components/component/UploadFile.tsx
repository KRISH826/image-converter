import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Badge } from '../ui/badge'

const title = 'Submit Your Report'
const description = 'Attach supporting documents to complete your submission.'
const maxFiles = 6
const maxSizeMB = 25
const files = 20

const UploadFile = () => {
    return (
        <Card className="mx-auto w-full shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_2px_-1px_rgba(0,0,0,0.06),0px_2px_4px_0px_rgba(0,0,0,0.04)] ring-0">
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-foreground text-base leading-snug font-semibold tracking-tight">
                            {title}
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 tabular-nums">
                        6 / 6
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                
            </CardContent>
        </Card>
    )
}

export default UploadFile