import { Property } from './index.js'
import { PropertyFactory } from '../factories/index.js';
import { SerializationError } from '../index.js';

export class TupleProperty extends Property {
    constructor(props) {
        super();
        this.Type = 'Tuple';
        this.Properties = props;
    }
    get Size() {
        return this.Properties.reduce((acc, cur) => acc.Size + cur.Size) + 9;
    }
    serialize() {
        let buf = Buffer.alloc(this.Size);
        let offset = 0;
        for(let i = 0; i < this.Properties.length; i++) {
            offset += this.Properties[i].serialize().copy(buf, offset)
        }
        offset = buf.writeInt32LE(5, offset);
        offset += buf.write('None\0', offset);
        if(offset !== this.Size)
            throw new SerializationError(this);
        return buf
    }
    static from(obj) {
        let tuple = new TupleProperty([]);
        obj.Properties.forEach(prop => tuple.Properties.push(PropertyFactory.create(prop)));
        return tuple;
    }
}