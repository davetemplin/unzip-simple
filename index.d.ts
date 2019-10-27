export interface UnzipFile {
    name: string;
    buffer?: Buffer;
    compressed: number;
    uncompressed: number;
}
export interface UnzipOptions {
    input: string | Buffer | number;
    filter: string;
    extract: boolean;
}
export default function (options: Partial<UnzipOptions> | string | Buffer | number): Promise<UnzipFile[]>;
