import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className='flex-between navbar'>
      <div className='flex-1 flex-start gap-10'>
        <Link href='/'>
          <Image src='/logo.svg' alt='Flexibble Logo' width={115} height={43} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
