import styles from './spinner.module.css'

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'white'
}

export function Spinner({ size = 'md', color = 'primary' }: SpinnerProps) {
    return (
        <div className={`${styles.spinner} ${styles[size]} ${styles[color]}`}>
            <div className={styles.circle}></div>
        </div>
    )
}
