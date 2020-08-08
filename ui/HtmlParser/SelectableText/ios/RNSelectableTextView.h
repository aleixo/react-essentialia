#if __has_include(<RCTText/RCTBaseTextInputView.h>)
#import <RCTText/RCTBaseTextInputView.h>
#else
#import "RCTBaseTextInputView.h"
#endif

NS_ASSUME_NONNULL_BEGIN

@interface RNSelectableTextView : RCTBaseTextInputView

@property (nonnull, nonatomic, copy) NSString *value;
@property (nonatomic, copy) RCTDirectEventBlock onSelection;
@property (nullable, nonatomic, copy) NSArray<NSString *> *menuItems;
@property (nullable, nonatomic, copy) NSArray<NSString *> *highlightMenuItems;
@property (nullable, nonatomic, copy) NSArray<NSDictionary *> *highlights;
@property (nonatomic, copy) RCTDirectEventBlock onHighlightPress;

@end

NS_ASSUME_NONNULL_END
