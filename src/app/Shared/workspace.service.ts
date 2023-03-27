import { Inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  query,
  orderBy,
  docData,
  Firestore,
  updateDoc,
  arrayUnion,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
interface workspaceColor {
  text: string;
  bg: string;
}

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  colors: workspaceColor[] = [
    {
      bg: '#291f9d',
      text: '#f8e058',
    },
    {
      bg: '#dec3d7',
      text: '#191658',
    },
    {
      bg: '#daade0',
      text: '#382a57',
    },
    {
      bg: '#bcd6ef',
      text: '#0c148c',
    },
    {
      bg: '#91f6c7',
      text: '#1a0771',
    },
    {
      bg: '#2d25bb',
      text: '#dac6f9',
    },
    {
      bg: '#e29efc',
      text: '#26135d',
    },
    {
      bg: '#d3d4f5',
      text: '#2412a7',
    },
    {
      bg: '#5dfc5a',
      text: '#2a235d',
    },
    {
      bg: '#dbe9b0',
      text: '#1c0285',
    },
    {
      bg: '#0219b2',
      text: '#dbceef',
    },
    {
      bg: '#c6baf7',
      text: '#18135e',
    },
  ];

  constructor(private firestore: Firestore) {}

  async createWorkspace(workspaceName: string): Promise<string> {
    const workspaces = collection(this.firestore, 'workspaces');
    const selectedColor = this.colors[Math.floor(Math.random() * 12)];
    const body = {
      name: workspaceName,
      taskList: [],
      createdAt: new Date().getTime(),
      bgColor: selectedColor.bg,
      color: selectedColor.text,
    };
    const workspaceId = await addDoc(workspaces, body)
      .then((res) => res.id)
      .catch((error) => console.log(error));
    return workspaceId ?? '';
  }

  getWorkspaces(): Observable<any> {
    const workspaces = query(
      collection(this.firestore, 'workspaces'),
      orderBy('createdAt')
    );

    return collectionData(workspaces, {
      idField: 'workspaceId',
    });
  }

  getWorkspace(workspaceId: string): Observable<any> {
    const workspace = doc(this.firestore, 'workspaces', workspaceId);
    return docData(workspace, { idField: 'workspaceId' });
  }

  async createTodo(workspaceId: string, todoName: string): Promise<string> {
    const workspace = doc(this.firestore, 'workspaces', workspaceId);
    const todo = {
      workspaceId: workspaceId,
      createdAt: new Date().getTime(),
      name: todoName,
      note: '',
      priority: 'low',
      dueDate: new Date().toDateString(),
    };

    await updateDoc(workspace, { taskList: arrayUnion(todo) });

    return '';
  }
}

