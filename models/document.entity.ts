import { model, Schema, Types } from 'mongoose';

export interface IDocument {
    title: string;
    content: string;
    user_id: number;
}

export const DocumentSchema = new Schema<IDocument>(
    {
        title: { type: 'String', required: true },
        content: { type: 'String', required: true },
        user_id: { type: 'number', require: true}
    },
    { timestamps: true },
)

export const Document = model<IDocument>('documents', DocumentSchema);