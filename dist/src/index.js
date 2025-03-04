"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("../cors");
const dotenv_1 = __importDefault(require("dotenv"));
const chat_1 = __importDefault(require("./routes/chat"));
const client_1 = require("@prisma/client");
const express = require('express');
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
function main() {
    const app = express();
    const port = 8080;
    app.use((0, cors_1.default)(cors_2.corsOptions));
    app.use(express.json());
    app.get('/notes', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const notes = yield prisma.note.findMany();
            console.log(notes);
            return res.status(200).json({ notes });
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar notas' });
        }
    }));
    app.delete('/notes/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            yield prisma.note.delete({
                where: { id: Number(id) },
            });
            return res.status(200).json({ message: 'Nota deletada com sucesso' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar' });
        }
    }));
    app.post('/notes', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { title, details, category } = req.body;
        try {
            const newNote = yield prisma.note.create({
                data: { title, details, category },
            });
            return res.status(201).json(newNote);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro ao criar nota' });
        }
    }));
    app.use('/api', chat_1.default);
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
main();
