import dynamic from 'next/dynamic';
const TetoTest = dynamic(() => import('../../src/tests/tetotest/TetoTest'), { ssr: false });
export default TetoTest;
